import { Direction } from "./Direction";
import { DirectionHandler } from "./DirectionHandler";
import { GridPhysics } from "./GridPhysics";
import { KeyEventHandler } from "./KeyEventHandler";

export class GridControls {
  private directionController;
  private keyEventHandler: KeyEventHandler;
  private isEnabled: boolean = true;
  constructor(
    input: Phaser.Input.InputPlugin,
    private gridPhysics: GridPhysics
  ) {
    this.directionController = new DirectionHandler(input)
    this.keyEventHandler = new KeyEventHandler(input, {
      'event': Phaser.Input.Keyboard.KeyCodes.E
    })

    input.on(
      "DISABLE_CONTROL",
      () => this.disable(),
      this
    );
    input.on(
      "ENABLE_CONTROL",
      () => this.enable(),
      this
    );
  }

  update() {
    if (!this.isEnabled) { return }
    if (this.directionController.isLeft()) {
      this.gridPhysics.movePlayer(Direction.LEFT);
    } else if (this.directionController.isRight()) {
      this.gridPhysics.movePlayer(Direction.RIGHT);
    } else if (this.directionController.isDown()) {
      this.gridPhysics.movePlayer(Direction.DOWN);
    } else if (this.directionController.isUp()) {
      this.gridPhysics.movePlayer(Direction.UP);
    } else if (this.keyEventHandler.isJustDown('event')) {
      this.gridPhysics.interactionPlayer()
    }
  }

  disable() {
    this.isEnabled = false;
  }

  enable() {
    this.isEnabled = true;
  }
}
