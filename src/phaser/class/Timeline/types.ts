import type {
  ChatContentType,
  ChoiceContentType,
  DialogPlugin,
  ExternalPageContentType,
  HidePictureContentType,
  NextTimelineContentType,
  ShowPictureContentType,
  SwitchSceneContentType,
} from '@/phaser/plugin/dialogPlugin'

export interface TimelineContent {
  process(): void
}

export class ChatContent implements TimelineContent {
  constructor(private dialogPlugin: DialogPlugin, private content: ChatContentType) { }

  process(): void {
    this.dialogPlugin.setTextByContent(this.content)
  }
}

export class ChoiceContent implements TimelineContent {
  constructor(
    private dialogPlugin: DialogPlugin,
    private content: ChoiceContentType,
  ) {}

  process(): void {
    this.dialogPlugin.setChoiceByContent(this.content)
  }
}

export class NextTimelineContent implements TimelineContent {
  constructor(
    private dialogPlugin: DialogPlugin,
    private content: NextTimelineContentType,
  ) {}

  process(): void {
    this.dialogPlugin.setTimelineByContent(this.content)
  }
}

export class ShowPictureContent implements TimelineContent {
  constructor(
    private dialogPlugin: DialogPlugin,
    private content: ShowPictureContentType,
  ) { }

  process(): void {
    this.dialogPlugin.setShowPictureByContent(this.content)
  }
}

export class HidePictureContent implements TimelineContent {
  constructor(
    private dialogPlugin: DialogPlugin,
    private content: HidePictureContentType,
  ) {}

  process(): void {
    this.dialogPlugin.setHidePictureByContent(this.content)
  }
}

export class SceneChangeContent implements TimelineContent {
  constructor(
    private dialogPlugin: DialogPlugin,
    private content: SwitchSceneContentType,
  ) {}

  process(): void {
    this.dialogPlugin.setSceneByContent(this.content)
  }
}

export class ExternalPageContent implements TimelineContent {
  constructor(
    private content: ExternalPageContentType,
  ) {}

  process(): void {
    const url = this.content.url
    const externalWindow = window.open(url, '_blank')

    if (externalWindow && externalWindow.focus)
      externalWindow.focus()
    else if (!externalWindow)
      window.location.href = url
  }
}
