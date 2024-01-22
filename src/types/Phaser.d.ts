import { TimelinePlugin } from "@/components/plugin/TimelinePlugin";
import { DialogPlugin } from "@/components/plugin/dialogPlugin";
import { NPCManagerPlugin } from "@/components/plugin/NPCManagerPlugin"

declare module "phaser" {
  namespace Scenes {
    interface Systems {
      dialogPlugin: DialogPlugin;
      timelinePlugin: TimelinePlugin;
    }
  }
  interface Scene {
    dialogPlugin: DialogPlugin;
    npcManager: NPCManagerPlugin;
    getTilesize: () => number;
  }
}
