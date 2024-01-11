

export class SceneBase extends Phaser.Scene {
  constructor(sceneConfig?: string | Phaser.Types.Scenes.SettingsConfig) {
    super(sceneConfig);
  }

  getTilesize() {
    return 32;
  }
}
