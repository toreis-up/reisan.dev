import Phaser from "phaser";
import { Player } from "../phasercore/Player";
import { GridControls } from "../phasercore/GridControls";
import { GridPhysics } from "../phasercore/GridPhysics";
import { Direction } from "../phasercore/Direction";
import { ContentType, Timeline } from "@/components/plugin/types/dialog";
import { NPC } from "../class/NPC";
import { SceneBase } from "./SceneBase";

export class TestScene extends SceneBase {
  static readonly TILE_SIZE = 32;
  private gridControls!: GridControls;
  private gridPhysics!: GridPhysics;

  constructor() {
    super("TestScene");
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
    this.load.spritesheet("slime", "character/reisan.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.spritesheet("canvan", "character/canvan.png", {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.image("tiles2", "character/Anim_Slimes_SpriteSheet.png");
    // this.load.scenePlugin("dialogPlugin",
    // DialogPlugin,
    // "dialogPlugin",
    // 'dialog')
    // this.load.scenePlugin("timelinePlugin", TimelinePlugin, "timelinePlugin", "timeline")
  }
  create() {
    const map = this.make.tilemap({ key: "map" });

    const tiles = map.addTilesetImage("map", "tiles");
    const tiles2 = map.addTilesetImage("slime", "tiles2");

    const layer = map.createLayer(0, tiles!, 0, 0);
    layer?.setDepth(-3);

    const layer2 = map.createLayer(1, tiles!, 0, 0);
    layer2?.setDepth(-2);

    const layer3 = map.createLayer(2, tiles!, 0, 0);
    layer3?.setDepth(-1);

    const layer4 = map.createLayer(3, tiles2!, 0, 0);
    layer4?.setDepth(0);

    const timelines = [
      {
        start: [
          {
            type: ContentType.CHAT,
            text: "nekodesu konnnitiha hajimemasite matsuodesu",
          },
          { type: ContentType.CHAT, text: "inudesu" },
          {
            type: ContentType.CHOICE,
            text: "choice?",
            choices: [
              { text: "iti", nextId: "iti" },
              { text: "ni", nextId: "ni" },
            ],
          },
        ],
        iti: [{ type: ContentType.CHAT, text: "oh you choiced one!" }],

        ni: [{ type: ContentType.CHAT, text: "wwwwooooww you selected two!" }],
      },
    ] as Timeline[];
    const slimeNPC = new NPC(
      this,
      new Phaser.Math.Vector2(5, 5),
      "slime",
      timelines,
      1
    );
    const slimeNPCSplite = this.add.existing(slimeNPC);
    slimeNPCSplite.scale = 2;

    const playerSprite = this.add.sprite(0, 0, "player");
    playerSprite.setDepth(5);
    playerSprite.scale = 2;
    this.cameras.main.startFollow(playerSprite);
    this.cameras.main.roundPixels = true;
    const player = new Player(playerSprite, new Phaser.Math.Vector2(6, 6));

    const canvanTimeline = [
      {
        start: [
          {type: ContentType.CHAT, text: "「Vueが好きです」と書いてある。"},
          {type: ContentType.CHAT, text: "シーン飛びます"},
          {type: ContentType.SCENE, sceneId: "skillScene"}
        ]
      }
    ] as Timeline[]
    const canvanNPC = new NPC(this, new Phaser.Math.Vector2(10,5), "canvan", canvanTimeline);
    const canvanNPCSplite = this.add.existing(canvanNPC);
    canvanNPCSplite.scale = 2

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.gridPhysics = new GridPhysics(player, map);
    this.gridControls = new GridControls(this.input, this.gridPhysics);

    // this.plugins.installScenePlugin(
    //   "dialogPlugin",
    //   DialogPlugin,
    //   "dialog",
    //   this
    // );

    // this.plugins.installScenePlugin(
    //   "timelinePlugin",
    //   TimelinePlugin,
    //   "dialog",
    //   this
    // );

    // this.sys.dialogPlugin.init();
    // this.sys.timelinePlugin.init();

    const timeline = {
      start: [
        {
          type: ContentType.CHAT,
          text: "nekodesu konnnitiha hajimemasite matsuodesu",
        },
        { type: ContentType.CHAT, text: "inudesu" },
        {
          type: ContentType.SCENE, sceneId: "skillScene"
        }
      ],
    } as Timeline;

    this.dialogPlugin.init()
    this.dialogPlugin.setTimeline(timeline)

    this.createPlayerAnimation(Direction.UP, 11, 9);
    this.createPlayerAnimation(Direction.DOWN, 0, 2);
    this.createPlayerAnimation(Direction.LEFT, 3, 5);
    this.createPlayerAnimation(Direction.RIGHT, 6, 8);

    // this.scene.switch("skillScene")
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
