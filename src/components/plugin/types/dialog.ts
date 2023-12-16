export type TimelineContent = {
  speakerName?: string,
  text: string,
}

export type Timeline = {
  "start": TimelineContent[],
  [id: string]: TimelineContent[]
}
