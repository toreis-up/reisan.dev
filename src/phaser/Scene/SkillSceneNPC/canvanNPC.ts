import type { Scene } from 'phaser'
import { NPC } from '@/phaser/class/NPC'
import type { DialogPlugin, Timeline } from '@/phaser/plugin/dialogPlugin'
import { ChoiceContent, SwitchSceneContent } from '@/phaser/class/Timeline/types'

function canvanTimeline(dialogPlugin: DialogPlugin) {
  return [
    {
      start: [new ChoiceContent(dialogPlugin, {
        text: 'メインシーンへ帰りますか？',
        choices: [{ text: 'はい', nextId: 'return' }, {
          text: 'いいえ',
          nextId: '',
        }],
      })],
      return: [new SwitchSceneContent(dialogPlugin, {
        sceneId: 'MainScene',
      })],
    },
  ] as Timeline[]
}
export class CanvanNPC extends NPC {
  constructor(scene: Scene) {
    super(scene, new Phaser.Math.Vector2(8, 15), 'canvan', canvanTimeline(scene.dialogPlugin), 1)
  }
}
