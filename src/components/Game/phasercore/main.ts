import Phaser from "phaser";
import { TestScene } from "../Scene/TestScene";

const testScene = new TestScene();
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
    scene: [testScene],
    dom: {
      createContainer: true,
    },
    canvasStyle: `display: block; width: 100%; height: 100%;`,
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
