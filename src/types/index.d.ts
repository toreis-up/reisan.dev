declare module 'card.json' {
  export const front: Array<CardContent>
  export const back: Array<CardContent>
}

interface CardContent {
  position: Array<number>
  text: string
  color?: string
  fontSize?: number
}
