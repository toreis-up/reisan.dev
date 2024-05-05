import type { TimelineContent } from '@/phaser/class/Timeline/types'

export interface Timeline {
  start: TimelineContent[]
  [id: TimelineId]: TimelineContent[]
}

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
  nextId?: TimelineId
}

export interface ChatContentType {
  text: string
  speakerName?: string
}

export interface SwitchSceneContentType {
  sceneId: string
}

export interface ChoiceContentType {
  choices: Choice[]
  text?: string
  speakerName?: string
}

export interface NextTimelineContentType {
  nextId: TimelineId
}

export interface ExternalPageContentType {
  url: string
}

export interface ShowPictureContentType {
  path: string // assets/dialogからの相対パス
}

export interface HidePictureContentType {
  path: string
}
