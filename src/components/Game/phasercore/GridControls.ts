import { Direction } from "./Direction";
import { DirectionHandler } from "./DirectionHandler";
import { GridPhysics } from "./GridPhysics";

export class GridControls {
  private directionController;
  constructor(
    input: Phaser.Input.InputPlugin,
    private gridPhysics: GridPhysics
  ) {
    this.directionController = new DirectionHandler(input)
  }

  update() {
    if (this.directionController.isLeft()) {
      this.gridPhysics.movePlayer(Direction.LEFT);
    } else if (this.directionController.isRight()) {
      this.gridPhysics.movePlayer(Direction.RIGHT);
    } else if (this.directionController.isDown()) {
      this.gridPhysics.movePlayer(Direction.DOWN);
    } else if (this.directionController.isUp()) {
      this.gridPhysics.movePlayer(Direction.UP);
    }
  }
}
