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

import { ContentType } from '@/phaser/plugin/dialogPlugin'

export interface TimelineContent {
  type: string
  process(): void
}

export class ChatContent implements TimelineContent {
  constructor(private dialogPlugin: DialogPlugin, private content: ChatContentType) { }

  type = ContentType.CHAT
  process(): void {
    this.dialogPlugin.setTextByContent(this.content)
  }
}

export class ChoiceContent implements TimelineContent {
  constructor(
    private dialogPlugin: DialogPlugin,
    private content: ChoiceContentType,
  ) {}

  type = ContentType.CHOICE
  process(): void {
    this.dialogPlugin.setChoiceByContent(this.content)
  }
}

export class NextTimelineContent implements TimelineContent {
  constructor(
    private dialogPlugin: DialogPlugin,
    private content: NextTimelineContentType,
  ) { }

  type = ContentType.NEXTTL
  process(): void {
    this.dialogPlugin.setTimelineByContent(this.content)
  }
}

export class ShowPictureContent implements TimelineContent {
  constructor(
    private dialogPlugin: DialogPlugin,
    private content: ShowPictureContentType,
  ) { }

  type = ContentType.SHOW_PICTURE
  process(): void {
    this.dialogPlugin.setShowPictureByContent(this.content)
  }
}

export class HidePictureContent implements TimelineContent {
  constructor(
    private dialogPlugin: DialogPlugin,
    private content: HidePictureContentType,
  ) {}

  type = ContentType.HIDE_PICTURE
  process(): void {
    this.dialogPlugin.setHidePictureByContent(this.content)
  }
}

export class SwitchSceneContent implements TimelineContent {
  constructor(
    private dialogPlugin: DialogPlugin,
    private content: SwitchSceneContentType,
  ) {}

  type = ContentType.SCENE
  process(): void {
    this.dialogPlugin.setSceneByContent(this.content)
  }
}

export class ExternalPageContent implements TimelineContent {
  constructor(
    private content: ExternalPageContentType,
  ) { }

  type = ContentType.EXTERNALURL

  process(): void {
    const url = this.content.url
    const externalWindow = window.open(url, '_blank')

    if (externalWindow && externalWindow.focus)
      externalWindow.focus()
    else if (!externalWindow)
      window.location.href = url
  }
}
