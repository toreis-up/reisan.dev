import Phaser from "phaser";
import { Player } from "../phasercore/Player";
import { GridControls } from "../phasercore/GridControls";
import { GridPhysics } from "../phasercore/GridPhysics";
import { Direction } from "../phasercore/Direction";
import { DialogPlugin } from "@/components/plugin/dialogPlugin";
import { ContentType, Timeline } from "@/components/plugin/types/dialog";
import { SceneEventHandler } from "../phasercore/SceneEventHandler";

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
    this.load.image("tiles2", "character/Anim_Slimes_SpriteSheet.png");
  }
  create() {
    const map = this.make.tilemap({ key: "map" });

    const tiles = map.addTilesetImage("map", "tiles");
    const tiles2 = map.addTilesetImage("slime", "tiles2")

    const layer = map.createLayer(0, tiles!, 0, 0);
    layer?.setDepth(0);

    const layer2 = map.createLayer(1, tiles!, 0, 0);
    layer2?.setDepth(1);

    const layer3 = map.createLayer(2, tiles!, 0, 0);
    layer3?.setDepth(2);

    const layer4 = map.createLayer(3, tiles2!, 0, 0);
    layer4?.setDepth(3);

    const playerSprite = this.add.sprite(0, 0, "player");
    playerSprite.setDepth(5);
    playerSprite.scale = 3;
    this.cameras.main.startFollow(playerSprite);
    this.cameras.main.roundPixels = true;
    const player = new Player(playerSprite, new Phaser.Math.Vector2(6, 6));

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.gridPhysics = new GridPhysics(player, map);
    this.gridControls = new GridControls(this.input, this.gridPhysics);

    this.plugins.installScenePlugin(
      "dialogPlugin",
      DialogPlugin,
      "dialog",
      this
    );

    this.sys.dialogPlugin.init();

    this.sys.events.on(
      "DISABLE_CONTROL",
      () => this.gridControls.disable(),
      this
    );
    this.sys.events.on(
      "ENABLE_CONTROL",
      () => this.gridControls.enable(),
      this
    );

    const timeline = {"start": [
      { type: ContentType.CHAT, text: "nekodesu konnnitiha hajimemasite matsuodesu"} ,
      { type: ContentType.CHAT, text: "inudesu"},
    ]} as Timeline;
    // this.sys.dialogPlugin.setText('こんちゃ')
    this.sys.dialogPlugin.setTimeline(timeline);

    const handler = new SceneEventHandler(this, this.sys.dialogPlugin)

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
