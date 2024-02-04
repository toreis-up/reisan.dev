import type { Scene } from 'phaser'
import { NPC } from '../../class/NPC'
import type { Timeline } from '@/components/plugin/types/dialog'
import { ContentType } from '@/components/plugin/types/dialog'

const canvanTimeline = [
  {
    start: [
      { type: ContentType.CHAT, text: '「Vueが好きです」と書いてある。' },
      { type: ContentType.CHAT, text: 'シーン飛びます' },
      { type: ContentType.SCENE, sceneId: 'skillScene' },
    ],
  },
] as Timeline[]

export class CanvanNPC extends NPC {
  constructor(scene: Scene) {
    super(scene, new Phaser.Math.Vector2(10, 5), 'canvan', canvanTimeline, 1)
  }
}
