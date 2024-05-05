import type { Scene } from 'phaser'
import { NPC } from '@/phaser/class/NPC'
import type { DialogPlugin, Timeline } from '@/phaser/plugin/dialogPlugin'
import { ChatContent, ChoiceContent } from '@/phaser/class/Timeline/types'

function timelines(dialogPlugin: DialogPlugin) {
  return [
    {
      start: [
        new ChatContent(dialogPlugin, {
          text: 'え…ドッペルゲンガー？！',
        }),
        new ChatContent(dialogPlugin, {
          text: 'ドッペルゲンガーじゃん！',
        }),
        new ChoiceContent(dialogPlugin, {
          text: 'ドッペルゲンガーだと思いますか？',
          choices: [
            { text: '思う', nextId: 'yes' },
            { text: '思わない', nextId: 'no' },
          ],
        }),
      ],
      yes: [
        new ChatContent(dialogPlugin, { text: 'まあもう慣れっこだけどね' })],

      no: [
        new ChatContent(dialogPlugin, { text: 'ほなドッペルゲンガーと違うかー。' })],
    },
  ] as Timeline[]
}
export class NPC_Reisan extends NPC {
  constructor(scene: Scene) {
    super(scene, new Phaser.Math.Vector2(5, 5), 'npc1_reisan', timelines(scene.dialogPlugin), 1)
  }
}
