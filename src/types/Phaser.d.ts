// import type { TimelinePlugin } from '@/components/plugin/TimelinePlugin'
import type { DialogPlugin } from '@/components/plugin/dialogPlugin'
import type { NPCManagerPlugin } from '@/components/plugin/NPCManagerPlugin'

declare module 'phaser' {
  namespace Scenes {
    interface Systems {
      dialogPlugin: DialogPlugin
      // timelinePlugin: TimelinePlugin
    }
  }
  interface Scene {
    dialogPlugin: DialogPlugin
    npcManager: NPCManagerPlugin
    getTilesize: () => number
  }
}
