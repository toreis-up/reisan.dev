import type { Scene } from 'phaser'
import type {
  ChatContent,
  Choice,
  ChoiceContent,
  NextTimelineContent,
  SwitchSceneContent,
  Timeline,
  TimelineContent,
} from './types/dialog'
import {
  ContentType,
} from './types/dialog'

export class DialogPlugin extends Phaser.Plugins.ScenePlugin {
  protected config = {} as DialogConfig
  protected graphics?: Phaser.GameObjects.Graphics
  protected visible = false
  private text?: Phaser.GameObjects.Text
  private closeBtn?: Phaser.GameObjects.Text
  private dialogText = [] as string[]
  private dialogTextIndex = 0
  private timedEvent: undefined | Phaser.Time.TimerEvent
  private timelineContent = [] as TimelineContent[]
  private timelineIndex = 0
  private timeline = {} as Timeline
  private uiLayer: Phaser.GameObjects.Container

  constructor(
    scene: Scene,
    pluginManager: Phaser.Plugins.PluginManager,
    pluginKey: string,
  ) {
    super(scene, pluginManager, pluginKey)
    this.scene = scene
    this.systems = scene.sys

    if (!scene.sys.settings.isBooted)
      scene.sys.events.once('boot', this.boot, this)

    console.log(scene)

    if (scene.scene.isActive()) {
      console.log('active')
      this.uiLayer = scene.add.container(0, 0)
      this.uiLayer.setVisible(true)
      this.uiLayer.setDepth(255)
    }
    else {
      console.log('not active')
      this.systems.events.once(
        Phaser.Scenes.Events.START,
        () => {
          this.uiLayer = scene.add.container(0, 0)
          this.uiLayer.setVisible(true)
          this.uiLayer.setDepth(255)
          console.log(scene)
        },
        this,
      )
      this.uiLayer = {} as Phaser.GameObjects.Container
    }
  }

  boot() {
    const eventEmitter = this.systems?.events

    eventEmitter?.on(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this)
    eventEmitter?.on(Phaser.Scenes.Events.DESTROY, this.destroy, this);
    (this.scene?.events.listenerCount('dialogStart') || 0) < 1
      ? eventEmitter?.on('dialogStart', (e: Timeline) => {
        console.log('event handled')
        this.setTimeline(e)
      }, this)
      : console.log('The listener has already registered. Skip.')

    this.systems?.scale.on(
      Phaser.Scale.Events.RESIZE,
      () => this.resize(),
      this,
    )
  }

  shutdown() {
    if (this.timedEvent)
      this.timedEvent.remove()
    if (this.text)
      this.text.destroy()
    this.timelineContent = []
  }

  destroy(): void {
    this.shutdown()
    this.scene = null
  }

  init(opts?: ModalOptions) {
    console.log('INIT ISSUED')
    this.config.borderThickness = opts?.borderThickness || 3
    this.config.borderColor = opts?.borderColor || 0x907748
    this.config.borderAlpha = opts?.borderAlpha || 1
    this.config.windowAlpha = opts?.windowAlpha || 0.8
    this.config.windowColor = opts?.windowColor || 0x303030
    this.config.windowHeight = opts?.windowHeight || 150
    this.config.padding = opts?.padding || 32
    this.config.dialogSpeed = opts?.dialogSpeed || 3

    this.config.eventCounter = 0

    this.config.visible = true

    this._createWindow()
  }

  private _getGameWidth() {
    return this.scene?.sys.game.canvas.width || 1920
  }

  private _getGameHeight() {
    return this.scene?.sys.game.canvas.height || 1080
  }

  private _calculateWindowDimensions(width: number, height: number) {
    const x = this.config.padding + (this.scene?.cameras.main.scrollX || 0)
    const y
      = height
      - this.config.windowHeight
      - this.config.padding
      + (this.scene?.cameras.main.scrollY || 0)
    const rectWidth = width - this.config.padding * 2
    const rectHeight = this.config.windowHeight
    return { x, y, rectWidth, rectHeight }
  }

  private _createInnerWindow(
    x: number,
    y: number,
    rectWidth: number,
    rectHeight: number,
  ) {
    this.graphics?.fillStyle(this.config.windowColor, this.config.windowAlpha)
    this.graphics?.fillRect(x + 1, y + 1, rectWidth - 1, rectHeight - 1)
  }

  private _createOuterWindow(
    x: number,
    y: number,
    rectWidth: number,
    rectHeight: number,
  ) {
    this.graphics?.lineStyle(
      this.config.borderThickness,
      this.config.borderColor,
      this.config.borderAlpha,
    )
    this.graphics?.strokeRect(x, y, rectWidth, rectHeight)
  }

  private _createWindow() {
    const gameHeight = this._getGameHeight()
    const gameWidth = this._getGameWidth()
    const dimensions = this._calculateWindowDimensions(gameWidth, gameHeight)
    this.graphics = this.scene?.add.graphics()
    this.graphics?.setDepth(0)

    this._createOuterWindow(
      dimensions.x,
      dimensions.y,
      dimensions.rectWidth,
      dimensions.rectHeight,
    )
    this._createInnerWindow(
      dimensions.x,
      dimensions.y,
      dimensions.rectWidth,
      dimensions.rectHeight,
    )
  }

  private _resizeWindow() {
    const gameHeight = this._getGameHeight()
    const gameWidth = this._getGameWidth()
    const dimensions = this._calculateWindowDimensions(gameWidth, gameHeight)

    this.graphics?.clear()
    this._createOuterWindow(
      dimensions.x,
      dimensions.y,
      dimensions.rectWidth,
      dimensions.rectHeight,
    )
    this._createInnerWindow(
      dimensions.x,
      dimensions.y,
      dimensions.rectWidth,
      dimensions.rectHeight,
    )
  }

  resize() {
    console.log('called')
    if (this.scene?.scene.isActive()) {
      this._resizeWindow()
      this._resizeText()
    }
  }

  private _resizeText() {
    const gameHeight = this._getGameHeight()
    const gameWidth = this._getGameWidth()
    const dimensions = this._calculateWindowDimensions(gameWidth, gameHeight)
    this.text?.style.setWordWrapWidth(dimensions.rectWidth)
  }

  setTimeline(timeline: Timeline, sceneId = 'start') {
    this.resize()
    this._openWindow()
    this.timelineIndex = 0
    this.scene?.input.emit('DISABLE_CONTROL')
    this.timeline = timeline
    this.timelineContent = timeline[sceneId]
    // this.uiLayer?.removeAll();

    this._next()
  }

  private _setTimeline(sceneId: string) {
    this.timelineIndex = 0
    this.timelineContent = this.timeline[sceneId]
  }

  private toggleWindow() {
    this.visible = !this.visible
    if (this.text)
      this.text.visible = this.visible
    if (this.graphics)
      this.graphics.visible = this.visible
    if (this.closeBtn)
      this.closeBtn.visible = this.visible
  }

  closeWindow() {
    if (this.visible)
      this.toggleWindow()
    this.scene?.input.emit('ENABLE_CONTROL')
  }

  _openWindow() {
    if (!this.visible)
      this.toggleWindow()
  }

  setText(text: string, animate = true) {
    this.dialogTextIndex = 0
    this.dialogText = text.split('')
    if (this.timedEvent)
      this.timedEvent.remove()

    const tempText = animate ? '' : text

    this.visible = true
    this._setText(tempText)

    if (animate) {
      this.timedEvent = this.scene?.time.addEvent({
        delay: 150 - this.config.dialogSpeed * 30,
        callback: this._animateText,
        callbackScope: this,
        loop: true,
      }) || {} as Phaser.Time.TimerEvent
      this.scene?.input.keyboard?.once('keydown-SPACE', this._setFullText, this)
      this.scene?.input.once('pointerdown', this._setFullText, this)
    }
  }

  private _readyNext() {
    console.log(this.scene?.events)
    // this.scene?.input.once('keydown-SPACE', () => console.log('helllo'), this)
    console.log(this.timelineContent[this.timelineIndex - 1])
    if (
      this.timelineContent[this.timelineIndex - 1].type === ContentType.CHAT
    ) {
      this.scene?.input.keyboard?.once('keydown-SPACE', this._next, this)
      this.scene?.input.once('pointerdown', this._next, this)
    }
  }

  private _next() {
    this.scene?.input.keyboard?.off('keydown-SPACE', this._next, this)
    this.scene?.input.off('pointerdown', this._next, this)

    if (this.timelineIndex >= this.timelineContent.length) {
      this.closeWindow()
      return
    }
    if (this.timelineContent[this.timelineIndex].type === ContentType.CHAT) {
      this.setText((this.timelineContent[this.timelineIndex] as ChatContent).text)
    }
    else if (
      this.timelineContent[this.timelineIndex].type === ContentType.CHOICE
    ) {
      this.setChoice(this.timelineContent[this.timelineIndex] as ChoiceContent)
    }
    else if (
      this.timelineContent[this.timelineIndex].type === ContentType.NEXTTL
    ) {
      this.setTimeline(
        this.timeline,
        (this.timelineContent[this.timelineIndex] as NextTimelineContent).nextId,
      )
      return
    }
    else if (
      this.timelineContent[this.timelineIndex].type === ContentType.SCENE
    ) {
      this.scene?.scene.switch(
        (this.timelineContent[this.timelineIndex] as SwitchSceneContent).sceneId,
      )
      this.closeWindow()
      console.log('returnable')
      return
    }
    else {
      console.debug(
        this.timelineContent[this.timelineIndex].type === ContentType.CHAT,
      )
    }

    this.timelineIndex++
  }

  private setChoice(choice: ChoiceContent) {
    this.setText(choice.text || '')
    console.log('SET CHOICE')
    // this._readyNext()
    this._setChoice(choice.choices)
  }

  private _setChoice(choices: Choice[]) {
    const buttonHeight = 40
    const buttonMargin = 40
    const { width, height } = this.scene!.game.canvas
    const buttonGroupHeight
      = buttonHeight * choices.length + buttonMargin * (choices.length - 1)
    const buttonGroupOriginY = height / 2 - buttonGroupHeight / 2

    choices.forEach((choice, index) => {
      const y
        = buttonGroupOriginY
        + buttonHeight * (index + 0.5)
        + buttonMargin * index

      // Rectangleでボタンを作成
      const button = new Phaser.GameObjects.Rectangle(
        this.scene!,
        width / 2,
        y,
        width / 3,
        buttonHeight,
        this.config.windowColor,
        this.config.windowAlpha,
      ).setStrokeStyle(
        this.config.borderThickness,
        this.config.borderColor,
        this.config.windowAlpha,
      )
      button.setInteractive({
        useHandCursor: true,
      })

      this.uiLayer.add(button)

      // ボタンテキストを作成
      const buttonText = new Phaser.GameObjects.Text(
        this.scene!,
        width / 2,
        y,
        choice.text,
        {
          wordWrap: {
            width: this._getGameWidth()! - this.config.padding * 2 - 25,
          },
          fontFamily: 'DotGothic16',
          fontSize: '1.5rem',
        },
      ).setOrigin(0.5)

      // ボタンテキストをUIレイヤーに追加
      this.uiLayer.add(buttonText)

      button.once('pointerdown', () => {
        this.uiLayer.removeAllListeners()
        this.uiLayer.removeAll(true)
        this._setTimeline(choice.nextId)
        this._next()
      })
    })
  }

  private _setFullText() {
    this.timedEvent?.remove()
    this.text?.setText(this.dialogText.join(''))
    this.scene?.input.keyboard?.off('keydown-SPACE', this._setFullText, this)
    this.scene?.input.off('pointerdown', this._setFullText, this)
    this._readyNext()
  }

  private _animateText() {
    this.dialogTextIndex++
    this.text?.setText(
      this.text.text + this.dialogText[this.dialogTextIndex - 1],
    )
    if (this.dialogTextIndex === this.dialogText.length) {
      this.timedEvent?.remove()
      this.scene?.input.keyboard?.off('keydown-SPACE', this._setFullText, this)
      this.scene?.input.off('pointerdown', this._setFullText, this)
      this._readyNext()
    }
  }

  private _setText(text: string) {
    if (this.text)
      this.text.destroy()
    const x = this.config.padding + (this.scene?.cameras.main.scrollX || 0) + 10
    const y
      = this._getGameHeight()
      - this.config.windowHeight
      - this.config.padding
      + (this.scene?.cameras.main.scrollY || 0)
      + 10
    this.text = this.scene!.add.text(x, y, text, {
      wordWrap: { width: this._getGameWidth()! - this.config.padding * 2 - 25 },
      fontFamily: 'DotGothic16',
      fontSize: '1.5rem',
    })
  }
}

export interface ModalOptions {
  borderThickness?: number
  borderColor?: number
  borderAlpha?: number
  windowAlpha?: number
  windowColor?: number
  windowHeight?: number
  padding?: number
  dialogSpeed?: number
}

interface DialogConfig {
  borderThickness: number
  borderColor: number
  borderAlpha: number
  windowAlpha: number
  windowColor: number
  windowHeight: number
  padding: number
  dialogSpeed: number
  eventCounter: number
  visible: boolean
  text?: string
  dialog?: any
  graphics?: any
}
