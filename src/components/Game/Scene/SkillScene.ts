import { NPC } from '../class/NPC'
import { GridControls } from '../phasercore/GridControls'
import { GridPhysics } from '../phasercore/GridPhysics'
import { Player } from '../phasercore/Player'
import { SceneBase } from './SceneBase'
import { ContentType } from '@/components/plugin/types/dialog'
import type { Timeline } from '@/components/plugin/types/dialog'

export class SkillScene extends SceneBase {
  TILE_SIZE: number = 32
  private gridControls!: GridControls
  private gridPhysics!: GridPhysics

  constructor() {
    super('skillScene')
  }

  preload() {
    this.load.image('fandw', 'tilemap/inhouse/td_FloorsAndWalls.png')
    this.load.tilemapTiledJSON('ssmap', 'tileset/SkillPage/base.json')
  }

  update(_time: number, delta: number) {
    this.gridControls.update()
    this.gridPhysics.update(delta)
  }

  create() {
    const map = this.make.tilemap({ key: 'ssmap' })

    const floorAndWallTiles = map.addTilesetImage('indoor', 'fandw')

    const layerBase = map.createLayer(0, floorAndWallTiles!, 0, 0)
    layerBase?.setDepth(0)
    layerBase?.setScale(2)

    const playerSprite = this.add.sprite(0, 0, 'player')
    playerSprite.setDepth(5)
    playerSprite.scale = 2
    this.cameras.main.startFollow(playerSprite)
    this.cameras.main.roundPixels = true
    console.log(map.widthInPixels, map.heightInPixels)

    const player = new Player(playerSprite, new Phaser.Math.Vector2(16, 16))

    const canvanTimeline = [
      {
        start: [
          { type: ContentType.CHAT, text: '「Vueが好きです」と書いてある。' },
          { type: ContentType.CHAT, text: 'メインシーンへ移動します。' },
          { type: ContentType.SCENE, sceneId: 'MainScene' },
        ],
      },
    ] as Timeline[]
    const canvanNPC = new NPC(this, new Phaser.Math.Vector2(15, 15), 'canvan', canvanTimeline)
    const canvanNPCSplite = this.add.existing(canvanNPC)
    canvanNPCSplite.scale = 2

    const timeline = {
      start: [
        {
          type: ContentType.CHAT,
          text: 'nekodesu konnnitiha hajimemasite matsuodesu',
        },
        {
          type: ContentType.SCENE,
          sceneId: 'MainScene',
        },
      ],
    } as Timeline

    console.log(this.scene)
    this.npcManager.init()
    this.npcManager.addNPC(canvanNPC)

    this.cameras.main.setBounds(
      0,
      0,
      layerBase?.displayWidth || 1920,
      layerBase?.displayHeight || 1080)
    this.cameras.main.startFollow(playerSprite)
    this.cameras.main.roundPixels = true
    this.dialogPlugin.init()
    this.gridPhysics = new GridPhysics(player, map)
    this.gridControls = new GridControls(this.input, this.gridPhysics)
    this.sys.dialogPlugin.setTimeline(timeline)
  }
}
