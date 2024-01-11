import { SceneBase } from "./SceneBase";


export class SkillScene extends SceneBase {
  constructor() {
    super('skillScene');
  }
  preload() {
    this.load.image("scenebase", "tilemap/map1.png");
    this.load.image("fandw", "tilemap/inhouse/td_FloorsAndWalls.png");
    this.load.tilemapTiledJSON("map", "tileset/SkillPage/base.json");
    this.load.spritesheet("player", "character/reisan.png");
  }
  update() {

  }
  create() {
    const map = this.make.tilemap({ key: "map" })

    const sceneBase = map.addTilesetImage("Map", "scenebase");
    const floorAndWallTiles = map.addTilesetImage("indoor", "fandw");

    const layerBase = map.createLayer(0, sceneBase!, 0, 0);
    layerBase?.setDepth(0);

    const floorAndWallLayer = map.createLayer(0, floorAndWallTiles!, 0, 0);
    floorAndWallLayer?.setDepth(1);

    const player = this.add.sprite(0, 0, "player")
    player.setDepth(5)
    player.scale = 2
    this.cameras.main.startFollow(player)
    this.cameras.main.roundPixels = true
      ;
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
  }
}
