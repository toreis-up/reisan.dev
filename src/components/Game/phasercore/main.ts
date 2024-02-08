import Phaser from 'phaser'
import { MainScene } from '../Scene/MainScene'
import { SkillScene } from '../Scene/SkillScene'
import { AboutMeScene } from '../Scene/AboutMeScene'
import { LicenseScene } from '../Scene/LicenceScene'
import { DialogPlugin } from '@/components/plugin/dialogPlugin'
import { NPCManagerPlugin } from '@/components/plugin/NPCManagerPlugin'

const testScene = new MainScene()
const skillScene = new SkillScene()
const aboutMeScene = new AboutMeScene()
const licenseScene = new LicenseScene()

let game: Phaser.Game

export function boot(containerId: string) {
  const config = {
    type: Phaser.AUTO,
    backgroundColor: '#2dab2d',
    pixelArt: true,
    width: '100%',
    height:
      window.innerHeight
      - document.getElementsByClassName('v-toolbar__content')[0].clientHeight,
    scale: {
      parent: containerId,
    },
    scene: [testScene, skillScene, aboutMeScene, licenseScene],
    dom: {
      createContainer: true,
    },
    canvasStyle: 'display: block; width: 100%; height: 100%;',
    plugins: {
      scene: [{ plugin: DialogPlugin, key: 'dialogPlugin', mapping: 'dialogPlugin', systemKey: 'dialogPlugin', sceneKey: 'dialogScenePlugin', start: true } as Phaser.Types.Core.PluginObjectItem,
        { plugin: NPCManagerPlugin, key: 'npcManager', mapping: 'npcManager', systemKey: 'npcManager', sceneKey: 'npcManagerPlugin', start: true }],
    },
  }

  game = new Phaser.Game(config)
  return game
}

window.addEventListener('resize', () => {
  game.scale.resize(
    window.innerWidth,
    window.innerHeight
      - document.getElementsByClassName('v-toolbar__content')[0].clientHeight,
  )
})
