export interface Timeline {
  start: TimelineContent[]
  [id: TimelineId]: TimelineContent[]
}

export type TimelineContent =
  | ChatContent
  | ChoiceContent
  | NextTimelineContent
  | SwitchExternalPageContent
  | SwitchSceneContent
  | PictureContent
  | RemovePictureContent

type TimelineId = string

export enum ContentType {
  'CHAT' = 'chat',
  'CHOICE' = 'choice',
  'NEXTTL' = 'nextTimeline',
  'EXTERNALURL' = 'externalURL',
  'SCENE' = 'scene',
  'PICTURE' = 'picture',
  'REM_PICTURE' = 'removePicture',
}

export interface Choice {
  text: string
  nextId: TimelineId
}

export interface ChatContent {
  type: ContentType.CHAT
  text: string
  speakerName?: string
}

export interface SwitchSceneContent {
  type: ContentType.SCENE
  sceneId: string
}

export interface ChoiceContent {
  type: ContentType.CHOICE
  choices: Choice[]
  text?: string
  speakerName?: string
}

export interface NextTimelineContent {
  type: ContentType.NEXTTL
  nextId: TimelineId
}

export interface SwitchExternalPageContent {
  type: ContentType.EXTERNALURL
  url: string
}

export interface PictureContent {
  type: ContentType.PICTURE
  path: string // assets/dialogからの相対パス
}

export interface RemovePictureContent {
  type: ContentType.REM_PICTURE
  path: string
}
