import { Direction } from './Direction'
import { DirectionHandler } from './DirectionHandler'
import type { GridPhysics } from './GridPhysics'
import { KeyEventHandler } from './KeyEventHandler'

export class GridControls {
  private directionController
  private keyEventHandler: KeyEventHandler
  private isEnabled: boolean = true
  private prevEnabledStat: boolean = false
  constructor(
    private input: Phaser.Input.InputPlugin,
    private gridPhysics: GridPhysics,
  ) {
    this.directionController = new DirectionHandler(input)
    this.keyEventHandler = new KeyEventHandler(input, {
      event: Phaser.Input.Keyboard.KeyCodes.E,
      Esc: Phaser.Input.Keyboard.KeyCodes.ESC,
    })

    input.on('DISABLE_CONTROL', () => this.disable(), this)
    input.on('ENABLE_CONTROL', () => this.enable(), this)
    input.on('ENTER_LICENSE', () => this.enterLicense(), this)
    input.on('RESUME_CONTROL', () => this.resume(), this)
    input.on('pointerdown', pointer => this.handleTouch(pointer), this)
  }

  private enterLicense() {
    if (this.input.scene.scene.key === 'licenseScene')
      return
    this.pause()
    this.input.scene.scene.pause()
    this.input.scene.scene.run('licenseScene', this.input.scene)
  }

  private async handleTouch(pointer: Phaser.Input.Pointer) {
    if (!this.isEnabled)
      return
    this.disable()
    await this.gridPhysics.moveTo({
      x: Math.floor(pointer.worldX / this.input.scene.getTilesize()),
      y: Math.floor(pointer.worldY / this.input.scene.getTilesize()),
    } as Phaser.Math.Vector2)
      .catch(() => {})
      .finally(() => {
        this.enable()
      })
      .then(() => {
        this.gridPhysics.interactionPlayer()
      })
  }

  update() {
    if (this.keyEventHandler.isJustDown('Esc')) {
      this.pause()
      this.input.scene.scene.pause()
      this.input.scene.scene.run('aboutMeScene', this.input.scene)
    }
    if (!this.isEnabled)
      return
    if (this.directionController.isLeft())
      this.gridPhysics.movePlayer(Direction.LEFT)
    else if (this.directionController.isRight())
      this.gridPhysics.movePlayer(Direction.RIGHT)
    else if (this.directionController.isDown())
      this.gridPhysics.movePlayer(Direction.DOWN)
    else if (this.directionController.isUp())
      this.gridPhysics.movePlayer(Direction.UP)
    else if (this.keyEventHandler.isJustDown('event'))
      this.gridPhysics.interactionPlayer()
  }

  disable() {
    this.isEnabled = false
  }

  enable() {
    this.isEnabled = true
  }

  pause() {
    this.prevEnabledStat = this.isEnabled
    this.disable()
  }

  resume() {
    this.isEnabled = this.prevEnabledStat
  }
}
