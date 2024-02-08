import EscMenuControls from '../phasercore/EscMenuControls'
import { SceneBase } from './SceneBase'

const licenseText = `
ASSETS LICENCE (Escキーで閉じる)

MAP BASE:\tPenzilla(https://penzilla.itch.io/top-down-retro-interior)
MAP BASE:\tUses the "16x16 RPG Tileset" by hilau
\t\tat https://opengameart.org/content/16x16-rpg-tileset,
\t\twhich is based off of "16x16 Game Assets" by George Bailey
\t\tat https://opengameart.org/content/16x16-game-assets.
\t\tand "LPC Thatched-roof Cottage" by bluecarrot16
\t\tat https://opengameart.org/content/lpc-thatched-roof-cottage.

VUE LOGO:  © Evan You (https://github.com/vuejs/art) 2016.
\t\tLicensed under CC BY-SA 4.0

`

export class LicenseScene extends SceneBase {
  private menuControls!: EscMenuControls
  private licenseUiLayer!: Phaser.GameObjects.Container

  constructor() {
    super('licenseScene')
  }

  update() {
    this.menuControls.update()
  }

  private updateCalledByScene(scene: Phaser.Scene) {
    this.menuControls.updateCalledByScene(scene)
  }

  create(scene: Phaser.Scene) {
    this.sys.events.on(Phaser.Scenes.Events.WAKE, (_thisScene: Phaser.Scene, ...args: Phaser.Scene[]) => {
      this.updateCalledByScene(args[0])
    })
    this.licenseUiLayer = this.add.container(0, 0)
    this.menuControls = new EscMenuControls(scene.input, this)

    const width = this.scene.systems.game.canvas.width
    const height = this.scene.systems.game.canvas.height

    const background = new Phaser.GameObjects.Rectangle(
      this,
      width / 2,
      height / 2,
      width,
      height,
    )
    background.setFillStyle(0x545454, 0.5)
    this.licenseUiLayer.add(background)

    const nameContainer = this.add.container(0, 0)
    this.licenseUiLayer.add(nameContainer)

    const dialog = new Phaser.GameObjects.Rectangle(
      this,
      (width / 2) + this.scene.scene.cameras.main.scrollX,
      height / 2 + this.scene.scene.cameras.main.scrollY,
      (width / 7) * 5,
      (height / 6) * 5,
    )
      .setStrokeStyle(3, 0x907748, 1)
      .setFillStyle(0x454851, 0.9)

    const dialogTextObject = this.add.text(
      width / 7 + this.scene.scene.cameras.main.scrollX + 10,
      height / 2
        + this.scene.scene.cameras.main.scrollY
        - (height / 12) * 5
        + 10,
      licenseText,
      {
        fontFamily: 'DotGothic16',
        fontSize: '1.5rem',
        lineSpacing: 16,
        wordWrap: { width: width / 7 * 5 - 25 },
      },
    )

    this.licenseUiLayer.add(dialog)
    this.licenseUiLayer.add(dialogTextObject)
  }
}
