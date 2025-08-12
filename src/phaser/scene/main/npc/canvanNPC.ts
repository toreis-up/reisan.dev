import type { DialogPlugin, Timeline } from '#/plugin/dialogPlugin'
import type { Scene } from 'phaser'
import { NPC } from '#/class/NPC'
import { ChatContent, ChoiceContent, SwitchSceneContent } from '#/class/Timeline/types'

function canvanTimeline(dialogPlugin: DialogPlugin) {
  return [
    {
      start: [
        new ChatContent(dialogPlugin, {
          text: '何が見たいですか？',
        }),
        new ChoiceContent(dialogPlugin, {
          text: '見たいものを選んでください',
          choices: [{ text: 'スキル', nextId: 'skillScene' }, { text: '別に…' }],
        }),
      ],
      skillScene: [new SwitchSceneContent(dialogPlugin, {
        sceneId: 'skillScene',
      })],
    },
  ] as Timeline[]
}

export class CanvanNPC extends NPC {
  constructor(scene: Scene) {
    super(scene, new Phaser.Math.Vector2(10, 5), 'canvan', canvanTimeline(scene.dialogPlugin), 1)
  }
}
