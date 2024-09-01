import { SceneBase } from '#/class/Scene'

export class PreloadScene extends SceneBase {
  constructor() {
    super('PreloadScene')
  }

  preload() {
    this.load.on('complete', () => {
      this.scene.switch('MainScene')
    })
    this.load.image('tiles', 'tilemap/map1.png')
    this.load.tilemapTiledJSON('map', 'tileset/map2.json')
    this.load.spritesheet('player', 'character/reisan.png', {
      frameWidth: 32,
      frameHeight: 48,
    })
    this.load.spritesheet('npc1_reisan', 'character/reisan.png', {
      frameWidth: 32,
      frameHeight: 48,
    })
    this.load.spritesheet('canvan', 'character/canvan.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
  }

  create() {
    this.npcManager.init()
    this.dialogPlugin.init()
  }
}
