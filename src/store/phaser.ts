// Utilities
import { defineStore } from 'pinia'

export const usePhaserStore = defineStore('phaser', {
  state: () => ({
    gameInstance: null as Phaser.Game | null,
  }),
  actions: {
    setGameInstance(gameInstance: Phaser.Game) {
      this.gameInstance = gameInstance
    },
    freeGameInstance() {
      this.gameInstance = null
    },
  },
})
