import { DialogPlugin } from "@/components/plugin/dialogPlugin";

declare module "phaser" {
  namespace Scenes {
    interface Systems {
      dialogPlugin: DialogPlugin;
    }
  }
}
