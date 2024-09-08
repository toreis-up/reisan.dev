import type Phaser from 'phaser'
import type { Dict } from '@/types/utils'

// TODO: Re-implement with usual class
export default class WindowPool {
  private _pool: WPool
  private static _instance: WindowPool

  constructor() {
    this._pool = {} as WPool
  }

  static getInstance() {
    if (!this._instance)
      this._instance = new WindowPool()

    return this._instance
  }

  get(scene: Phaser.Scene | null) {
    if (!scene)
      return null
    const sceneName = this._getSceneNameByScene(scene)
    const obj = this._pool[sceneName] ?? this.create(scene)
    return obj
  }

  create(scene: Phaser.Scene) {
    const newGraphic = scene.add.graphics().setDepth(0)
    const sceneName = this._getSceneNameByScene(scene)
    this._pool[sceneName] = newGraphic

    return newGraphic
  }

  private _getSceneNameByScene(scene: Phaser.Scene) {
    return scene.scene.key
  }
}

type WPool = Dict<Phaser.GameObjects.Graphics>
