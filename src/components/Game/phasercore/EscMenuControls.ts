import { KeyEventHandler } from './KeyEventHandler'

export default class EscMenuControls {
  private keyEventHandler: KeyEventHandler
  private calledScene: Phaser.Scene

  constructor(private input: Phaser.Input.InputPlugin) {
    this.keyEventHandler = new KeyEventHandler(input, {
      Esc: Phaser.Input.Keyboard.KeyCodes.ESC,
    })
    this.calledScene = this.input.scene
  }

  update() {
    if (this.keyEventHandler.isJustDown('Esc')) {
      this.input.emit('ENABLE_CONTROL')
      this.input.scene.scene.switch(this.calledScene)
    }
  }
}
