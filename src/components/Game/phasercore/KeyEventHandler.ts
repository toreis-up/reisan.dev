import Phaser from 'phaser';

type Keys = {[keyof: string]: number}
type Keyset = {[keyof: string]: Phaser.Input.Keyboard.Key}

export class KeyEventHandler {
  private keyHandler?: Keyset;
  constructor(private input: Phaser.Input.InputPlugin, private keys: Keys) {
    this.keyHandler = this.input.keyboard?.addKeys({
      ...keys
    }) as Keyset;
  }

  isPress(keyName: string): boolean {
    return this.keyHandler?.[keyName].isDown || false
  }
}