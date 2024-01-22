import { Direction } from "./Direction";
import { Player } from "./Player";

const Vector2 = Phaser.Math.Vector2;
type Vector2 = Phaser.Math.Vector2;

export class GridPhysics {
  private moveDirection: Direction = Direction.NONE;
  private lastMoveDirection: Direction = Direction.NONE;
  private lastMoveInputDirection: Direction = Direction.DOWN;
  private speedPixelsPerSecond: number = 0;
  private tileSizePixelsWalked: number = 0;

  constructor(
    private player: Player,
    private tileMap: Phaser.Tilemaps.Tilemap
  ) {
    this.speedPixelsPerSecond = tileMap.scene.getTilesize() * 6;
  }

  movePlayer(direction: Direction) {
    this.lastMoveDirection = direction;
    if (this.isMoving()) return;
    this.lastMoveInputDirection = direction;
    if (this.isBlockingDirection(direction)) {
      this.player.stopAnimation(direction);
    } else {
      this.startMoving(direction);
    }
  }

  private isMoving(): boolean {
    return this.moveDirection !== Direction.NONE;
  }

  private startMoving(direction: Direction) {
    this.player.startAnimation(direction);
    this.moveDirection = direction;
    this.updatePlayerTilePos();
  }

  update(delta: number) {
    if (this.isMoving()) {
      this.updatePlayerPosition(delta);
    }
    this.player.updateDepth();
    this.lastMoveDirection = Direction.NONE;
  }

  private updatePlayerPosition(delta: number) {
    const pixelsToWalkThisUpdate = this.getPixelsToWalkThisUpdate(delta);

    if (!this.willCrossTileBorderThisUpdate(pixelsToWalkThisUpdate)) {
      this.movePlayerSprite(pixelsToWalkThisUpdate);
    } else if (this.shouldContinueMoving()) {
      this.movePlayerSprite(pixelsToWalkThisUpdate);
      this.updatePlayerTilePos();
    } else {
      this.movePlayerSprite(this.tileMap.scene.getTilesize() - this.tileSizePixelsWalked);
      this.stopMoving();
    }
  }

  private shouldContinueMoving(): boolean {
    return (
      this.moveDirection == this.lastMoveDirection &&
      !this.isBlockingDirection(this.lastMoveDirection)
    );
  }

  private movePlayerSprite(pixelsToMove: number) {
    const directionVec = this.moveDirectionVectors[this.moveDirection]?.clone();
    const moveDistance = directionVec?.multiply(new Vector2(pixelsToMove));
    const newPlayerPos = this.player.getPosition().add(moveDistance!);
    this.player.setPosition(newPlayerPos);
    this.tileSizePixelsWalked += pixelsToMove;
    this.tileSizePixelsWalked %= this.tileMap.scene.getTilesize();
  }

  private willCrossTileBorderThisUpdate(pixelsToWalkThisUpdate: number) {
    return (
      this.tileSizePixelsWalked + pixelsToWalkThisUpdate >= this.tileMap.scene.getTilesize()
    );
  }

  private stopMoving() {
    this.player.stopAnimation(this.moveDirection);
    this.moveDirection = Direction.NONE;
  }

  private getPixelsToWalkThisUpdate(delta: number): number {
    const deltaInSeconds = delta / 1000;
    return this.speedPixelsPerSecond * deltaInSeconds;
  }

  private moveDirectionVectors: {
    [key in Direction]: Vector2;
  } = {
    [Direction.LEFT]: Vector2.LEFT,
    [Direction.DOWN]: Vector2.DOWN,
    [Direction.RIGHT]: Vector2.RIGHT,
    [Direction.UP]: Vector2.UP,
    [Direction.NONE]: Vector2.ZERO
  };

  private updatePlayerTilePos() {
    this.player.setTilePos(
      this.player
        .getTilePos()
        .add(this.moveDirectionVectors[this.moveDirection]!)
    );
  }

  private isBlockingDirection(direction: Direction): boolean {
    return this.hasBlockingTile(this.tilePosInDirection(direction));
  }

  private tilePosInDirection(direction: Direction): Vector2 {
    return this.player.getTilePos().add(this.moveDirectionVectors[direction]!);
  }

  private hasBlockingTile(pos: Vector2) {
    if (this.hasNoTile(pos)) return true;
    return this.tileMap.layers.some((layer) => {
      const tile = this.tileMap.getTileAt(pos.x, pos.y, false, layer.name);
      console.log(tile)
      return tile && tile.properties.collides;
    });
  }

  private hasNoTile(pos: Vector2) {
    return !this.tileMap.layers.some((layer) => {
      return this.tileMap.hasTileAt(pos.x, pos.y, layer.name);
    });
  }

  interactionPlayer() {
      console.log('interact from gp')
      this.tileMap.scene.events.emit('interactionDispatch', {scene: this.tileMap.scene, pos: this.tilePosInDirection(this.lastMoveInputDirection)})
  }
}
