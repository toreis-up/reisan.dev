import { Direction } from "./Direction";
import { GridPhysics } from "./GridPhysics";

type WASDKeys = {
  up: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
};

export class GridControls {
  constructor(
    private input: Phaser.Input.InputPlugin,
    private gridPhysics: GridPhysics
  ) {}

  update() {
    const cursors = this.input.keyboard?.createCursorKeys();
    const keys: WASDKeys | undefined = this.input.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    }) as WASDKeys | undefined;
    
    if (cursors?.left.isDown || keys?.left.isDown) {
      this.gridPhysics.movePlayer(Direction.LEFT);
    } else if (cursors?.right.isDown || keys?.right.isDown) {
      this.gridPhysics.movePlayer(Direction.RIGHT);
    } else if (cursors?.down.isDown || keys?.down.isDown) {
      this.gridPhysics.movePlayer(Direction.DOWN);
    } else if (cursors?.up.isDown || keys?.up.isDown) {
      this.gridPhysics.movePlayer(Direction.UP);
    }
  }
}
