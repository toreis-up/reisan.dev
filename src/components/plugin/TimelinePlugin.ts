import { Scene } from "phaser";
import { ContentType, Timeline, TimelineContent } from "./types/dialog";
import { DialogPlugin } from "./dialogPlugin";

export class TimelinePlugin extends Phaser.Plugins.ScenePlugin {
  private timelineIndex = 0;
  private timelineContents?: TimelineContent[];
  private dialog: DialogPlugin;

  constructor(
    scene: Scene,
    pluginManager: Phaser.Plugins.PluginManager,
    pluginKey: string
  ) {
    super(scene, pluginManager, pluginKey);
    this.scene = scene;
    this.systems = scene.sys;

    if (!scene.sys.settings.isBooted) {
      scene.sys.events.once("boot", this.boot, this);
    }

    this.dialog = new DialogPlugin(scene, pluginManager, pluginKey)
  }

  setTimeline(timeline: Timeline) {
    this.timelineIndex = 0;
    this.systems?.events.emit("DISABLE_CONTROL");
    this.timelineContents = timeline["start"];
    this._next();
  }

  private _next() {
    // this.scene?.events.off('keydown', this._next, this)

    if (this.timelineIndex >= this.timelineContents.length) {
      this.dialog.closeWindow();
      return;
    }

    const timelineContent = this.timelineContents[this.timelineIndex++];

    switch (timelineContent.type) {
      case ContentType.CHAT:
        this.dialog.setText(timelineContent.text)
        break;

      default:
        return;
    }

    this._next()
  }
}
