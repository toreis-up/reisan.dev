export type Timeline = {
  "start": TimelineContent[],
  [id: TimelineId]: TimelineContent[]
}

export type TimelineContent =
  | ChatContent
  | ChoiceContent
  | NextTimelineContent
  | SwitchExternalPageContent
  | SwitchSceneContent;

type TimelineId = string;

export enum ContentType {
  'CHAT' = 'chat',
  'CHOICE' = 'choice',
  'NEXTTL' = 'nextTimeline',
  'EXTERNALURL' = 'externalURL',
  'SCENE' = 'scene',
}

export type Choice = {
  text: string,
  nextId: TimelineId,
}

type ChatContent = {
  type: ContentType.CHAT
  text: string,
  speakerName?: string,
}

export type SwitchSceneContent = {
  type: ContentType.SCENE;
  sceneId: string,
}

export type ChoiceContent = {
  type: ContentType.CHOICE;
  choices: Choice[];
  text?: string,
  speakerName?: string
};

export type NextTimelineContent = {
  type: ContentType.NEXTTL;
  nextId: TimelineId;
};

export type SwitchExternalPageContent = {
  type: ContentType.EXTERNALURL;
  url: string;
};
