import { DialogPlugin } from "@/components/plugin/dialogPlugin";
import { ContentType, Timeline } from "@/components/plugin/types/dialog";
import { Scene } from "phaser";

export class SceneEventHandler {
  constructor(scene: Scene, private dialogPlugin: DialogPlugin) {
    // scene.events.on('interactionDispatch', (e:any) => this.eventHandler(e), this)
  }

  eventHandler(e: any) {
    console.log(e)
    const timeline = {
      start: [
        {
          type: ContentType.CHAT,
          text: "ぷるぷる",
        },
        { type: ContentType.CHAT, text: "ぼく わるい スライムじゃ ないよ" },
      ],
    } as Timeline;
    this.dialogPlugin.setTimeline(timeline)
  }
}
