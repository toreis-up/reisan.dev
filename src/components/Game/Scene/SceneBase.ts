

export class SceneBase extends Phaser.Scene {
  TILE_SIZE = 32;
  constructor(sceneConfig?: string | Phaser.Types.Scenes.SettingsConfig) {
    super(sceneConfig);
  }

  getTilesize = () => {
    return this.TILE_SIZE;
  }
}
