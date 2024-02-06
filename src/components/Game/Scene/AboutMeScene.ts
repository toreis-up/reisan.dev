import EscMenuControls from '../phasercore/EscMenuControls'
import { SceneBase } from './SceneBase'

export class AboutMeScene extends SceneBase {
  private menuControls!: EscMenuControls
  private uiLayer: Phaser.GameObjects.Container

  constructor() {
    super('aboutMeScene')
  }

  update() {
    this.menuControls.update()
  }

  create(scene?: Phaser.Scene) {
    this.uiLayer = this.add.container(0, 0)
    this.menuControls = new EscMenuControls(scene?.input || this.input)
  }
}
