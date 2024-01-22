
import { Timeline } from "@/components/plugin/types/dialog";
import Phaser, { Scene } from "phaser";


export class NPC extends Phaser.GameObjects.Sprite {

  constructor(scene: Scene, private pos: Phaser.Math.Vector2, texture: string | Phaser.Textures.Texture, private timelines: Timeline[], frame?: string | number) {
    super(scene, pos.x, pos.y, texture, frame);
    const offsetX = scene.getTilesize() / 2;
    const offsetY = scene.getTilesize();

    this.setOrigin(0.5, 1);
    this.setPosition(
      pos.x * scene.getTilesize() + offsetX,
      pos.y * scene.getTilesize() + offsetY
      );

    this.setDepth((pos.y + 0.5));
    console.log(this.pos)
    this.scene.events.on('interactionDispatch', (e: {pos:Phaser.Math.Vector2, scene: Phaser.Scene}) => this.interaction(e.pos, e.scene))
  }

  interaction(position: Phaser.Math.Vector2, scene: Phaser.Scene) {
    // console.log('NPC EVENT START')
    // console.log(position, this.pos)
    if (this.pos.x != position.x || this.pos.y!= position.y)
      return;

    if (scene != this.scene)
      return;

    console.log(this.pos)
    this.scene.events.emit('dialogStart', this.timelines[0])
  }
}
