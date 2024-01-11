export type Timeline = {
  "start": TimelineContent[],
  [id: TimelineId]: TimelineContent[]
}

export type TimelineContent =
  | ChatContent
  | ChoiceContent
  | NextTimelineContent
  | SwitchExternalPageContent;

type TimelineId = string;

export enum ContentType {
  'CHAT' = 'chat',
  'CHOICE' = 'choice',
  'NEXTTL' = 'nextTimeline',
  'EXTERNALURL' = 'externalURL',
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

export type ChoiceContent = {
  type: ContentType.CHOICE;
  choices: Choice[];
  text?: string,
  speakerName?: string
};

type NextTimelineContent = {
  type: ContentType.NEXTTL;
  nextId: TimelineId;
};

type SwitchExternalPageContent = {
  type: ContentType.EXTERNALURL;
  url: string;
};
