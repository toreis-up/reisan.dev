import type { DialogPlugin, Timeline } from '#/plugin/dialogPlugin'
import type { Scene } from 'phaser'
import { NPC } from '#/class/NPC'
import { ChatContent, ChoiceContent } from '#/class/Timeline/types'

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
        new ChatContent(dialogPlugin, { text: 'まあもう慣れっこだけどね' }),
      ],

      no: [
        new ChatContent(dialogPlugin, { text: 'ほなドッペルゲンガーと違うかー。' }),
      ],
    },
  ] as Timeline[]
}
export class ReisanNPC extends NPC {
  constructor(scene: Scene) {
    super(scene, new Phaser.Math.Vector2(5, 5), 'npc1_reisan', timelines(scene.dialogPlugin), 1)
  }
}
