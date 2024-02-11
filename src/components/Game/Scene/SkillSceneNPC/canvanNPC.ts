import type { Scene } from 'phaser'
import { NPC } from '../../class/NPC'
import type { Timeline } from '@/components/plugin/dialogPlugin'
import { ContentType } from '@/components/plugin/dialogPlugin'

const canvanTimeline = [
  {
    start: [
      {
        type: ContentType.CHOICE,
        text: 'メインシーンへ帰りますか？',
        choices: [{ text: 'はい', nextId: 'return' }, { text: 'いいえ' }],
      },
    ],
    return: [
      { type: ContentType.SCENE, sceneId: 'MainScene' },
    ],
  },
] as Timeline[]
export class CanvanNPC extends NPC {
  constructor(scene: Scene) {
    super(scene, new Phaser.Math.Vector2(8, 15), 'canvan', canvanTimeline, 1)
  }
}
