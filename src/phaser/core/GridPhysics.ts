import type { Player } from '../class/Player'
import { Direction } from './Direction'
import { BiDirectionalMap } from '@/utils'

const Vector2_C = Phaser.Math.Vector2
type Vector2 = Phaser.Math.Vector2

type Block = 1
type Path = 0

type MapElm = Block | Path

export class GridPhysics {
  private moveDirection: Direction = Direction.NONE
  private lastMoveDirection: Direction = Direction.NONE
  private lastMoveInputDirection: Direction = Direction.DOWN
  private speedPixelsPerSecond: number = 0
  private tileSizePixelsWalked: number = 0
  private mapMaze: MapElm[][]
  private moveDirectionVectorsMap = new BiDirectionalMap<Direction, Vector2>()

  constructor(
    private player: Player,
    private tileMap: Phaser.Tilemaps.Tilemap,
  ) {
    this.moveDirectionVectorsMap
      .set(Direction.LEFT, Vector2_C.LEFT)
      .set(Direction.RIGHT, Vector2_C.RIGHT)
      .set(Direction.UP, Vector2_C.UP)
      .set(Direction.DOWN, Vector2_C.DOWN)
      .set(Direction.NONE, Vector2_C.ZERO)

    this.speedPixelsPerSecond = tileMap.scene.getTilesize() * 6

    this.mapMaze = this.genMapPath(tileMap)
  }

  private gen2DArray<T>(x: number, y: number, val: T) {
    return [...Array(y)].map(_ => Array<T>(x).fill(val))
  }

  private genMapPath(tilemap: Phaser.Tilemaps.Tilemap) {
    const mapMaze = this.gen2DArray<MapElm>(tilemap.width, tilemap.height, 1)
    const mapTiles = this.tileAllLayer(tilemap)
    mapTiles.forEach((xTiles, yIdx) => {
      xTiles.forEach((layers, xIdx) => {
        mapMaze[yIdx][xIdx] = layers.map((tile) => {
          return tile.index === -1 || !(tile.properties.collides || this.isNPCTile({ x: xIdx, y: yIdx } as Vector2)) ? 0 : 1
        }).every(v => v === 0)
          ? 0
          : 1
      })
    })

    return mapMaze
  }

  private tileAllLayer(tilemap: Phaser.Tilemaps.Tilemap) {
    const tiles: Array<Array<Array<Phaser.Tilemaps.Tile>>> = this.gen2DArray<Phaser.Tilemaps.Tile[]>(tilemap.width, tilemap.height, [])
    tilemap.layers.forEach((layer) => {
      layer.data.forEach((xTiles) => {
        xTiles.forEach((tile) => {
          tiles[tile.y][tile.x] = tiles[tile.y][tile.x].concat([tile])
        })
      })
    })

    return tiles
  }

  async moveTo(pos: Vector2) {
    console.debug('called me with', pos)
    const paths = this.findPath(this.player.getTilePos(), pos)
    if (!paths.isSuccess)
      return Promise.reject(new Error('Cant find the path')) // TODO: Error const
    for (const dir of paths.path!)
      await this.movePlayerAsync(this.moveDirectionVectorsMap.getByValue(dir)!)
    await this.waitUntilFinishMoveAsync()
  }

  async waitUntilFinishMoveAsync() {
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (!this.isMoving()) {
          clearInterval(intervalId)
          resolve(undefined)
        }
      }, this.tileMap.scene.getTilesize())
    })
  }

  async movePlayerAsync(direction: Direction) {
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (!this.isMoving()) {
          this.movePlayer(direction)
          clearInterval(intervalId)
          resolve(undefined)
        }
      }, this.tileMap.scene.getTilesize())
    })
  }

  private findPath(origin: Vector2, dist: Vector2) {
    const directions = [
      Vector2_C.RIGHT, // 右
      Vector2_C.LEFT, // 左
      Vector2_C.DOWN, // 下
      Vector2_C.UP, // 上
    ]

    const rows = this.tileMap.height
    const cols = this.tileMap.width

    const inBounds = (point: Vector2): boolean =>
      point.x >= 0 && point.x < cols && point.y >= 0 && point.y < rows

    const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false))
    const queue: { point: Vector2; path: Vector2[] }[] = [{ point: origin, path: [] }]

    visited[origin.y][origin.x] = true

    while (queue.length > 0) {
      const { point, path } = queue.shift()!

      // ゴールに到達した場合
      if (point.x === dist.x && point.y === dist.y)
        return { isSuccess: true, path }

      // 4方向に移動
      for (const dir of directions) {
        const nextPoint: Vector2 = { x: point.x + dir.x, y: point.y + dir.y } as Vector2

        if (inBounds(nextPoint) && !this.mapMaze[nextPoint.y][nextPoint.x] && !visited[nextPoint.y][nextPoint.x]) {
          visited[nextPoint.y][nextPoint.x] = true
          queue.push({ point: nextPoint, path: [...path, dir] })
        }
      }
    }

    // ゴールにたどり着けなかった場合
    return { isSuccess: false, path: null }
  }

  movePlayer(direction: Direction) {
    this.lastMoveDirection = direction
    if (this.isMoving())
      return
    this.lastMoveInputDirection = direction
    if (this.isBlockingDirection(direction))
      this.player.stopAnimation(direction)
    else this.startMoving(direction)
  }

  private isMoving(): boolean {
    return this.moveDirection !== Direction.NONE
  }

  private startMoving(direction: Direction) {
    this.player.startAnimation(direction)
    this.moveDirection = direction
    this.updatePlayerTilePos()
  }

  update(delta: number) {
    if (this.isMoving())
      this.updatePlayerPosition(delta)

    this.player.updateDepth()
    this.lastMoveDirection = Direction.NONE
  }

  private updatePlayerPosition(delta: number) {
    const pixelsToWalkThisUpdate = this.getPixelsToWalkThisUpdate(delta)

    if (!this.willCrossTileBorderThisUpdate(pixelsToWalkThisUpdate)) {
      this.movePlayerSprite(pixelsToWalkThisUpdate)
    }
    else if (this.shouldContinueMoving()) {
      this.movePlayerSprite(pixelsToWalkThisUpdate)
      this.updatePlayerTilePos()
    }
    else {
      this.movePlayerSprite(
        this.tileMap.scene.getTilesize() - this.tileSizePixelsWalked,
      )
      this.stopMoving()
    }
  }

  private shouldContinueMoving(): boolean {
    return (
      this.moveDirection === this.lastMoveDirection
      && !this.isBlockingDirection(this.lastMoveDirection)
    )
  }

  private movePlayerSprite(pixelsToMove: number) {
    const directionVec = this.moveDirectionVectorsMap.getByKey(this.moveDirection)?.clone()
    const moveDistance = directionVec?.multiply(new Vector2_C(pixelsToMove))
    const newPlayerPos = this.player.getPosition().add(moveDistance!)
    this.player.setPosition(newPlayerPos)
    this.tileSizePixelsWalked += pixelsToMove
    this.tileSizePixelsWalked %= this.tileMap.scene.getTilesize()
  }

  private willCrossTileBorderThisUpdate(pixelsToWalkThisUpdate: number) {
    return (
      this.tileSizePixelsWalked + pixelsToWalkThisUpdate
      >= this.tileMap.scene.getTilesize()
    )
  }

  private stopMoving() {
    this.player.stopAnimation(this.moveDirection)
    this.moveDirection = Direction.NONE
  }

  private getPixelsToWalkThisUpdate(delta: number): number {
    const deltaInSeconds = delta / 1000
    return this.speedPixelsPerSecond * deltaInSeconds
  }

  private updatePlayerTilePos() {
    this.player.setTilePos(
      this.player
        .getTilePos()
        .add(this.moveDirectionVectorsMap.getByKey(this.moveDirection)!),
    )
  }

  private isBlockingDirection(direction: Direction): boolean {
    return this.hasBlockingTile(this.tilePosInDirection(direction))
  }

  private tilePosInDirection(direction: Direction): Vector2 {
    return this.player.getTilePos().add(this.moveDirectionVectorsMap.getByKey(direction)!)
  }

  private hasBlockingTile(pos: Vector2) {
    if (this.hasNoTile(pos))
      return true
    return this.tileMap.layers.some((layer) => {
      const tile = this.tileMap.getTileAt(pos.x, pos.y, false, layer.name)
      console.log(tile)
      return tile && (tile.properties.collides || this.isNPCTile(pos))
    })
  }

  private hasNoTile(pos: Vector2) {
    return !this.tileMap.layers.some((layer) => {
      return this.tileMap.hasTileAt(pos.x, pos.y, layer.name)
    })
  }

  private isNPCTile(pos: Vector2) {
    return this.tileMap.scene.npcManager.hasNPC(pos)
  }

  interactionPlayer() {
    console.log('interact from gp')
    this.tileMap.scene.events.emit('interactionDispatch', {
      scene: this.tileMap.scene,
      pos: this.tilePosInDirection(this.lastMoveInputDirection),
    })
  }
}
