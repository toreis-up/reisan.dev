export interface Timeline {
  start: TimelineContent[]
  [id: TimelineId]: TimelineContent[]
}

export type TimelineContent =
  | ChatContentType
  | ChoiceContentType
  | NextTimelineContentType
  | ExternalPageContentType
  | SwitchSceneContentType
  | ShowPictureContentType
  | HidePictureContentType

type TimelineId = string

export enum ContentType {
  'CHAT' = 'chat',
  'CHOICE' = 'choice',
  'NEXTTL' = 'nextTimeline',
  'EXTERNALURL' = 'externalURL',
  'SCENE' = 'scene',
  'SHOW_PICTURE' = 'showPicture',
  'HIDE_PICTURE' = 'hidePicture',
}

export interface Choice {
  text: string
  nextId: TimelineId
}

export interface ChatContentType {
  type: ContentType.CHAT
  text: string
  speakerName?: string
}

export interface SwitchSceneContentType {
  type: ContentType.SCENE
  sceneId: string
}

export interface ChoiceContentType {
  type: ContentType.CHOICE
  choices: Choice[]
  text?: string
  speakerName?: string
}

export interface NextTimelineContentType {
  type: ContentType.NEXTTL
  nextId: TimelineId
}

export interface ExternalPageContentType {
  type: ContentType.EXTERNALURL
  url: string
}

export interface ShowPictureContentType {
  type: ContentType.SHOW_PICTURE
  path: string // assets/dialogからの相対パス
}

export interface HidePictureContentType {
  type: ContentType.HIDE_PICTURE
  path: string
}
