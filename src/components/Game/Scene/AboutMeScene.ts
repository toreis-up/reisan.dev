import EscMenuControls from '../phasercore/EscMenuControls'
import { SceneBase } from './SceneBase'

const today = new Date()
const birthday = new Date(2005, 3 - 1, 18) // month is index

const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

const dialogText = `名前：とれいす（toreis）
誕生日：${birthday.toLocaleDateString('ja-JP', dateOptions)}（${
  today.getFullYear()
  - birthday.getFullYear()
  - (today.getMonth() <= birthday.getMonth()
  && today.getDate() < birthday.getDate()
    ? 1
    : 0)
}歳）

学校：National Institute of Technology,
　　　Kisarazu College
所属：情報工学科 4年
`

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

    const dialogTextObject = this.add.text(
      width / 2 + this.scene.scene.cameras.main.scrollX + 10,
      height / 2
        + this.scene.scene.cameras.main.scrollY
        - (height / 12) * 5
        + 10,
      dialogText,
      {
        fontFamily: 'DotGothic16',
        fontSize: '1.5rem',
        lineSpacing: 16,
        wordWrap: { width: width / 7 * 3 - 25 },
      },
    )

    this.aboutMeUiLayer.add(dialog)
    this.aboutMeUiLayer.add(playerSprite)
    this.aboutMeUiLayer.add(dialogTextObject)

    playerSprite.anims.startAnimation('aboutMePlayerRotation')
  }
}
