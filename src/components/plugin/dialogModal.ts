import { Scene } from "phaser";

export class DialogPlugin extends Phaser.Plugins.ScenePlugin {
  protected config: DialogConfig
  protected graphics?: Phaser.GameObjects.Graphics

  constructor(scene: Scene, pluginManager: Phaser.Plugins.PluginManager, pluginKey: string) {
    super(scene, pluginManager, pluginKey)
    this.scene = scene;
    this.systems = scene.sys;

    if (!scene.sys.settings.isBooted) {
      scene.sys.events.once('boot', this.boot, this);
    }

    this.config = {} as DialogConfig;
  }

  boot() {
    const eventEmitter = this.systems?.events;

    eventEmitter?.on(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
    eventEmitter?.on(Phaser.Scenes.Events.DESTROY, this.destroy, this)
  }

  shutdown() {

  }

  destroy(): void {
      this.shutdown();
      this.scene = null;
  }

  init(opts: ModalOptions) {
    this.config.borderThickness = opts?.borderThickness || 3;
    this.config.borderColor = opts?.borderColor || 0x907748;
    this.config.borderAlpha = opts?.borderAlpha || 1;
    this.config.windowAlpha = opts?.windowAlpha || 0.8;
    this.config.windowColor = opts?.windowColor || 0x303030;
    this.config.windowHeight = opts?.windowHeight || 150;
    this.config.padding = opts?.padding || 32;
    this.config.closeBtnColor = opts?.closeBtnColor || 'darkgoldenrod';
    this.config.dialogSpeed = opts?.dialogSpeed || 3;

    this.config.eventCounter = 0;

    this.config.visible = true;

    this._createWindow();
  }

  _getGameWidth () {
    return this.scene?.sys.game.canvas.width;
  }

  _getGameHeight() {
    return this.scene?.sys.game.canvas.height;
  }

  _calculateWindowDimensions(width: number, height: number) {
    const x = this.config.padding;
    const y = height - this.config.windowHeight - this.config.padding;
    const rectWidth = width - (this.config.padding *2)
    const rectHeight = this.config.windowHeight;
    return {x, y, rectWidth, rectHeight}
  }

  _createInnerWindow(x: number, y: number, rectWidth:number, rectHeight:number) {
    this.graphics.fillStyle(this.config.windowColor, this.config.windowAlpha);
    this.graphics.fillRect(x + 1, y + 1, rectWidth - 1, rectHeight - 1);
  }

  _createOuterWindow (x:number, y:number, rectWidth:number, rectHeight:number) {
    this.graphics.lineStyle(this.config.borderThickness, this.config.borderColor, this.config.borderAlpha);
    this.graphics.strokeRect(x, y, rectWidth, rectHeight);
  }

  _createWindow() {
    const gameHeight = this._getGameHeight();
    const gameWidth = this._getGameWidth();
    const dimensions = this._calculateWindowDimensions(gameWidth, gameHeight);
    this.graphics = this.scene?.add.graphics();

    console.log(dimensions)

    this._createOuterWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
    this._createInnerWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
  }

  resize() {
    console.log('called')
    this._resizeWindow();
  }

  private _resizeWindow() {
    const gameHeight = this._getGameHeight();
    const gameWidth = this._getGameWidth();
    const dimensions = this._calculateWindowDimensions(gameWidth, gameHeight);

    this.graphics?.destroy()
    this.graphics = this.scene?.add.graphics();

    this._createOuterWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
    this._createInnerWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
  }
}

export type ModalOptions = {
  borderThickness?: number;
  borderColor?: number;
  borderAlpha?: number;
  windowAlpha?: number;
  windowColor?: number;
  windowHeight?: number;
  padding?: number;
  closeBtnColor?: string;
  dialogSpeed?: number;
}

type DialogConfig = {
  borderThickness: number;
  borderColor: number;
  borderAlpha: number;
  windowAlpha: number;
  windowColor: number;
  windowHeight: number;
  padding: number;
  closeBtnColor: string;
  dialogSpeed: number;
  eventCounter: number;
  visible: boolean;
  text?: string;
  dialog?: any;
  graphics?: any;
  closeBtn?: any;
}