import type { Scene } from 'phaser'
import { NPC } from '../../class/NPC'
import type { Timeline } from '@/components/plugin/types/dialog'
import { ContentType } from '@/components/plugin/types/dialog'

export class NPC_Reisan extends NPC {
  constructor(
    scene: Scene,
  ) {
    super(scene, new Phaser.Math.Vector2(5, 5), 'npc1_reisan', timelines, 1)
  }
}

const timelines = [
  {
    start: [
      {
        type: ContentType.CHAT,
        text: 'え…ドッペルゲンガー？！',
      },
      { type: ContentType.CHAT, text: 'ドッペルゲンガーじゃん！' },
      {
        type: ContentType.CHOICE,
        text: 'ドッペルゲンガーだと思いますか？',
        choices: [
          { text: '思う', nextId: 'yes' },
          { text: '思わない', nextId: 'no' },
        ],
      },
    ],
    yes: [{ type: ContentType.CHAT, text: 'まあもう慣れっこだけどね' }],

    no: [{ type: ContentType.CHAT, text: 'ほなドッペルゲンガーと違うかー。' }],
  },
] as Timeline[]
