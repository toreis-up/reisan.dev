import Phaser from "phaser";
import { TestScene } from "../Scene/TestScene";
import { SkillScene } from "../Scene/SkillScene";
import { DialogPlugin } from "@/components/plugin/dialogPlugin";

const testScene = new TestScene();
const skillScene = new SkillScene();

let game: Phaser.Game;

export const boot = (containerId: string) => {
  const config = {
    type: Phaser.AUTO,
    backgroundColor: "#2dab2d",
    pixelArt: true,
    width: "100%",
    height:
      window.innerHeight -
      document.getElementsByClassName("v-toolbar__content")[0].clientHeight,
    scale: {
      parent: containerId,
    },
    scene: [testScene, skillScene],
    dom: {
      createContainer: true,
    },
    canvasStyle: `display: block; width: 100%; height: 100%;`,
    plugins: {
      scene: [{plugin: DialogPlugin, key:"dialogPlugin", mapping: 'dialogPlugin', systemKey: "dialogPlugin", sceneKey: "dialogScenePlugin", start: true} as Phaser.Types.Core.PluginObjectItem]
    }
  };

  game = new Phaser.Game(config);
  return game;
};

window.addEventListener("resize", () => {
  game.scale.resize(
    window.innerWidth,
    window.innerHeight -
      document.getElementsByClassName("v-toolbar__content")[0].clientHeight
  );
});
