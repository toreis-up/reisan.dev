import { KeyEventHandler } from './KeyEventHandler'

export default class EscMenuControls {
  private keyEventHandler: KeyEventHandler
  private calledScene: Phaser.Scene

  constructor(private input: Phaser.Input.InputPlugin, private menuScene: Phaser.Scene) {
    this.keyEventHandler = new KeyEventHandler(menuScene.input, {
      Esc: Phaser.Input.Keyboard.KeyCodes.ESC,
    })
    this.calledScene = this.input.scene
  }

  update() {
    if (this.keyEventHandler.isJustDown('Esc')) {
      this.input.emit('ENABLE_CONTROL')
      this.menuScene.scene.sleep()
      this.menuScene.scene.resume(this.calledScene)
    }
  }
}
