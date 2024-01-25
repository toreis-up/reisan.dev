import Phaser from 'phaser'

export class DirectionHandler {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private keys?: WASDKeys
  constructor(private input: Phaser.Input.InputPlugin) {
    this.keys = this.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as WASDKeys | undefined
    this.cursors = input.keyboard?.createCursorKeys()
  }

  isUp(): boolean {
    return this.cursors?.up.isDown || this.keys?.up.isDown || false
  }

  isDown(): boolean {
    return this.cursors?.down.isDown || this.keys?.down.isDown || false
  }

  isLeft(): boolean {
    return this.cursors?.left.isDown || this.keys?.left.isDown || false
  }

  isRight(): boolean {
    return this.cursors?.right.isDown || this.keys?.right.isDown || false
  }
}

interface WASDKeys {
  up: Phaser.Input.Keyboard.Key
  right: Phaser.Input.Keyboard.Key
  left: Phaser.Input.Keyboard.Key
  down: Phaser.Input.Keyboard.Key
}
