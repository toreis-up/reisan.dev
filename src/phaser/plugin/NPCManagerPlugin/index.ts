import type { Scene } from 'phaser'
import type { NPC } from '#/class/NPC'

type Vector2 = Phaser.Math.Vector2

export class NPCManagerPlugin extends Phaser.Plugins.ScenePlugin {
  private npcs = [] as NPC[]

  constructor(
    scene: Scene,
    pluginManager: Phaser.Plugins.PluginManager,
    pluginKey: string,
    npcs?: NPC[],
  ) {
    super(scene, pluginManager, pluginKey)

    this.npcs = npcs || []
  }

  boot() {}

  hasNPC(pos: Vector2): boolean {
    return this.npcs.some((npc) => {
      const position = npc.getTilePosition()
      return position.x === pos.x && position.y === pos.y
    })
  }

  addNPC(...npcs: NPC[]) {
    this.npcs = this.npcs.concat(npcs)
  }
}
