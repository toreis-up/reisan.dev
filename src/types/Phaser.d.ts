import { TimelinePlugin } from "@/components/plugin/TimelinePlugin";
import { DialogPlugin } from "@/components/plugin/dialogPlugin";

declare module "phaser" {
  namespace Scenes {
    interface Systems {
      dialogPlugin: DialogPlugin;
      timelinePlugin: TimelinePlugin;
    }
  }
}
