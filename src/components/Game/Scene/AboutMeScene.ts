import EscMenuControls from '../phasercore/EscMenuControls'
import { SceneBase } from './SceneBase'

export class AboutMeScene extends SceneBase {
  private menuControls!: EscMenuControls
  private aboutMeUiLayer!: Phaser.GameObjects.Container

  constructor() {
    super('aboutMeScene')
  }

  update() {
    this.menuControls.update()
  }

  create(scene: Phaser.Scene) {
    this.aboutMeUiLayer = this.add.container(0, 0)
    this.menuControls = new EscMenuControls(scene.input, this)

    this.anims.create({
      key: 'aboutMePlayerRotation',
      frameRate: 1,
      frames: this.anims.generateFrameNumbers('player', {
        frames: [1, 4, 10, 7],
      }),
      repeat: -1,
    })

    const width = this.scene.systems.game.canvas.width
    const height = this.scene.systems.game.canvas.height

    const playerSprite = this.add.sprite(0, 0, 'player')
    playerSprite.setDepth(10)
    playerSprite.setScale(8)
    playerSprite.setFrame(1)
    playerSprite.setPosition(width / 4, height / 2)

    const background = new Phaser.GameObjects.Rectangle(
      this,
      width / 2,
      height / 2,
      width,
      height,
    )
    background.setFillStyle(0x545454, 0.5)
    this.aboutMeUiLayer.add(background)

    const nameContainer = this.add.container(0, 0)
    this.aboutMeUiLayer.add(nameContainer)

    const dialog = new Phaser.GameObjects.Rectangle(
      this,
      (width / 7) * 5 + this.scene.scene.cameras.main.scrollX,
      height / 2 + this.scene.scene.cameras.main.scrollY,
      (width / 7) * 3,
      (height / 6) * 5,
    )
      .setStrokeStyle(3, 0x907748, 1)
      .setFillStyle(0x454851, 0.9)

    this.aboutMeUiLayer.add(dialog)
    this.aboutMeUiLayer.add(playerSprite)

    playerSprite.anims.startAnimation('aboutMePlayerRotation')
  }
}
