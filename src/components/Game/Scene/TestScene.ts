import Phaser from "phaser";
import { Player } from "../phasercore/Player";
import { GridControls } from "../phasercore/GridControls";
import { GridPhysics } from "../phasercore/GridPhysics";
import { Direction } from "../phasercore/Direction";
import { DialogPlugin } from "@/components/plugin/dialogModal";

export class TestScene extends Phaser.Scene {
  static readonly TILE_SIZE = 32;
  private gridControls!: GridControls;
  private gridPhysics!: GridPhysics;

  constructor() {
    super('TestScene');
  }
  update(_time: number, delta: number) {
    this.gridControls.update();
    this.gridPhysics.update(delta);
  }
  preload() {
    this.load.image("tiles", "tilemap/map1.png");
    this.load.tilemapTiledJSON("map", "tileset/map2.json");
    this.load.spritesheet("player", "character/reisan.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }
  create() {
    const map = this.make.tilemap({ key: "map" });

    const tiles = map.addTilesetImage("map", "tiles");
    const layer = map.createLayer(0, tiles!, 0, 0);
    layer?.setDepth(0);

    const layer2 = map.createLayer(1, tiles!, 0, 0);
    layer2?.setDepth(1);

    const playerSprite = this.add.sprite(0, 0, "player");
    playerSprite.setDepth(2);
    playerSprite.scale = 3;
    this.cameras.main.startFollow(playerSprite);
    this.cameras.main.roundPixels = true;
    const player = new Player(playerSprite, new Phaser.Math.Vector2(6, 6));

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.gridPhysics = new GridPhysics(player, map);
    this.gridControls = new GridControls(this.input, this.gridPhysics);

    this.plugins.installScenePlugin(
      'dialogModal',
      DialogPlugin,
      'dialog',
      this
    )

    this.sys.dialogModal.init();

    this.createPlayerAnimation(Direction.UP, 11, 9);
    this.createPlayerAnimation(Direction.DOWN, 0, 2);
    this.createPlayerAnimation(Direction.LEFT, 3, 5);
    this.createPlayerAnimation(Direction.RIGHT, 6, 8);
  }

  private createPlayerAnimation(
    name: string,
    startFrame: number,
    endFrame: number
  ) {
    this.anims.create({
      key: name,
      frames: this.anims.generateFrameNumbers("player", {
        start: startFrame,
        end: endFrame,
      }),
      frameRate: 10,
      repeat: -1,
      yoyo: true,
    });
  }
}
