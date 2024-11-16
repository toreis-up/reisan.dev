import type { Scene } from 'phaser'
import type {
  TimelineContent,
} from '../../class/Timeline/types'
import WindowManager from './dialogWindowManager'
import type { ChatContentType, Choice, ChoiceContentType, HidePictureContentType, NextTimelineContentType, ShowPictureContentType, SwitchSceneContentType, Timeline } from '.'
import { ContentType } from '.'

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
  private windowManager: WindowManager

  constructor(
    scene: Scene,
    pluginManager: Phaser.Plugins.PluginManager,
    pluginKey: string,
  ) {
    super(scene, pluginManager, pluginKey)

    if (!scene.sys.settings.isBooted)
      scene.sys.events.once('boot', this.boot, this)

    if (scene.scene.isActive()) {
      console.debug('scene is active')
      this.uiLayer = scene.add.container(0, 0)
      this.uiLayer.setVisible(true)
      this.uiLayer.setDepth(255)
    }
    else {
      console.debug('scene is not active')
      this.systems?.events.once(
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
    this.windowManager = WindowManager.getInstance()
  }

  boot() {
    if (this.scene != null && this.scene.dialogDisabled)
      return
    this.init()
    const eventEmitter = this.systems?.events
    eventEmitter?.on(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this)
    eventEmitter?.on(Phaser.Scenes.Events.DESTROY, this.destroy, this);
    (this.scene?.events.listenerCount('dialogStart') || 0) < 1
      ? eventEmitter?.on(
        'dialogStart',
        (e: Timeline) => {
          console.log('event handled')
          this.setTimeline(e)
        },
        this,
      )
      : console.log('The listener has already registered. Skip.')
    this.systems?.scale.on(
      Phaser.Scale.Events.RESIZE,
      () => this.resize(),
      this,
    )
    this._createWindow()
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
    this.config.borderThickness = opts?.borderThickness || 3
    this.config.borderColor = opts?.borderColor || 0x907748
    this.config.borderAlpha = opts?.borderAlpha || 1
    this.config.windowAlpha = opts?.windowAlpha || 0.8
    this.config.windowColor = opts?.windowColor || 0x303030
    this.config.windowHeight = opts?.windowHeight || 150
    this.config.padding = opts?.padding || 32
    this.config.dialogSpeed = opts?.dialogSpeed || 3
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
    if (this.scene?.dialogDisabled)
      return
    const gameHeight = this._getGameHeight()
    const gameWidth = this._getGameWidth()
    const dimensions = this._calculateWindowDimensions(gameWidth, gameHeight)
    this.graphics = this.windowManager.get(this.scene)
    this.graphics?.setVisible(this.visible)
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
    this.graphics?.clear()
    this._createWindow()
  }

  resize() {
    console.debug('Resizing dialog')
    this._resizeWindow()
    this._resizeText()
  }

  private _resizeText() {
    const newPos = this._calculateTextPosition()
    this.text?.setX(newPos.x)
    this.text?.setY(newPos.y)
    this.text?.style.setWordWrapWidth(this._calculateTextWrapWidth(), true)
  }

  setTimeline(timeline: Timeline, sceneId = 'start') {
    this.resize()
    this._openWindow()
    this.timelineIndex = 0
    this.scene?.input.emit('DISABLE_CONTROL')
    this.timeline = timeline
    this.timelineContent = timeline[sceneId]
    this._next()
  }

  private _setTimeline(sceneId?: string) {
    this.timelineIndex = 0
    this.timelineContent = this.timeline[sceneId ?? '']
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

  private _openWindow() {
    if (!this.visible)
      this.toggleWindow()
  }

  public setTextByContent(content: ChatContentType) {
    this.setText(content.text)
  }

  private setText(text: string, animate = true) {
    this.dialogTextIndex = 0
    this.dialogText = text.split('')
    if (this.timedEvent)
      this.timedEvent.remove()

    const tempText = animate ? '' : text

    this.visible = true
    this._setText(tempText)

    if (animate) {
      this.timedEvent
        = this.scene?.time.addEvent({
          delay: 150 - this.config.dialogSpeed * 30,
          callback: this._animateText,
          callbackScope: this,
          loop: true,
        }) || ({} as Phaser.Time.TimerEvent)
      this.scene?.input.keyboard?.once(
        'keydown-SPACE',
        this._setFullText,
        this,
      )
      this.scene?.input.once('pointerdown', this._setFullText, this)
    }
  }

  private _readyNext(skipInteract = false) {
    if (skipInteract)
      setTimeout(() => this._next()) // to execute function without stack

    if (
      this.timelineContent ? this.timelineContent[this.timelineIndex - 1].type === ContentType.CHAT : false
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
    const currentTimelineContent = this.timelineContent[this.timelineIndex]
    console.debug(currentTimelineContent)

    currentTimelineContent.process()

    this.timelineIndex++
  }

  public setTimelineByContent(content: NextTimelineContentType) {
    this._setTimeline(content.nextId)
  }

  public setShowPictureByContent(content: ShowPictureContentType) {
    this.showPicture(content.path)
    this._readyNext(true)
  }

  public setHidePictureByContent(content: HidePictureContentType) {
    this.hidePicture(content.path)
    this._readyNext(true)
  }

  public setSceneByContent(content: SwitchSceneContentType) {
    this.scene?.scene.switch(content.sceneId)
    this.closeWindow()
  }

  private showPicture(imagePath: string, windowRatio = 75) {
    const { width: canvasWidth, height: canvasHeight }
      = this.scene!.game.canvas
    const { scrollX: cameraX, scrollY: cameraY } = this.scene!.cameras.main
    this.scene?.load.image(imagePath, `dialog/${imagePath.toLowerCase()}`)
    const imgObj = this.scene?.add.image(
      canvasWidth / 2 + cameraX,
      canvasHeight / 2 + cameraY,
      imagePath,
    )
    imgObj?.setDepth(255)

    if (!imgObj)
      return

    this.uiLayer.once(
      `REMOVE_${imagePath}`,
      () => {
        this.uiLayer.remove(imgObj)
        imgObj.destroy()
      },
      this,
    )

    if (!this.scene?.textures.exists(imagePath)) {
      this.scene?.load.once(Phaser.Loader.Events.COMPLETE, () => {
        imgObj?.setTexture(imagePath)
        const { width: imageWidth, height: imageHeight } = imgObj
        const widthExpandScale = (canvasWidth * windowRatio) / imageWidth / 100
        const heightExpandScale
          = (canvasHeight * windowRatio) / imageHeight / 100
        imgObj.scale
          = widthExpandScale < heightExpandScale
            ? widthExpandScale
            : heightExpandScale
        this.uiLayer.add(imgObj!)
      })
      this.scene?.load.start()
    }
  }

  public hidePicture(imagePath: string) {
    this.uiLayer.emit(`REMOVE_${imagePath}`)
  }

  public setChoiceByContent(choice: ChoiceContentType) {
    this.setText(choice.text || '')
    this._setChoice(choice.choices)
  }

  private _setChoice(choices: Choice[]) {
    const buttonHeight = 40
    const buttonMargin = 40
    const { width, height } = this.scene!.game.canvas
    const buttonGroupHeight
      = buttonHeight * choices.length + buttonMargin * (choices.length - 1)
    const buttonGroupOriginY = height / 2 - buttonGroupHeight / 2

    const { scrollX: cameraX, scrollY: cameraY } = this.scene!.cameras.main

    const offsetX = cameraX + width / 2

    choices.forEach((choice, index) => {
      const offsetY
        = buttonGroupOriginY
        + buttonHeight * (index + 0.5)
        + buttonMargin * index
        + cameraY

      // Rectangleでボタンを作成
      const button = new Phaser.GameObjects.Rectangle(
        this.scene!,
        offsetX,
        offsetY,
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
        offsetX,
        offsetY,
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
        this._setFullText()
        this.uiLayer.removeAllListeners()
        this.uiLayer.removeAll(true)
        this._setTimeline(choice.nextId)
        // eslint-disable-next-line eqeqeq
        if (this.timelineContent == undefined)
          setTimeout(() => this.closeWindow())
        else this._next()
      })
    })
  }

  private _setFullText() {
    this.timedEvent?.remove()
    this._setText(this.dialogText.join(''))
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
    const pos = this._calculateTextPosition()
    this.text = this.scene!.add.text(pos.x, pos.y, text, {
      wordWrap: {
        width: this._calculateTextWrapWidth(),
        useAdvancedWrap: true,
      },
      fontFamily: 'DotGothic16',
      fontSize: '1.5rem',
    })
  }

  private _calculateTextWrapWidth() {
    return this._getGameWidth()! - this.config.padding * 2 - 25
  }

  private _calculateTextPosition() {
    const pos: TextPosition = {
      x: this.config.padding + (this.scene?.cameras.main.scrollX || 0) + 10,
      y: this._getGameHeight()
          - this.config.windowHeight
          - this.config.padding
          + (this.scene?.cameras.main.scrollY || 0)
          + 10,
    }

    return pos
  }
}

interface TextPosition {
  x: number
  y: number
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
  text?: string
  dialog?: any
  graphics?: any
}
