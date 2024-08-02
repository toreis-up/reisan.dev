<script lang="ts">
import { defineComponent } from 'vue'
import { boot } from '@/phaser/main'
import { usePhaserStore } from '@/store/phaser'

const phaserStore = usePhaserStore()

export default defineComponent({
  name: 'PhaserContainer',
  props: {
    containerId: {
      type: String,
      default: () => 'phaser-container',
    },
  },
  data() {
    return {
      gameInstance: null as Phaser.Game | null,
    }
  },
  mounted() {
    console.log('Hi! Its loaded!')
    // eslint-disable-next-line eqeqeq
    if (this.gameInstance == undefined) {
      const newGameInstance = boot(this.containerId)
      phaserStore.setGameInstance(newGameInstance)
    }
  },
  created() {
    this.gameInstance = phaserStore.gameInstance
  },
})
</script>

<template>
  <div :id="containerId" class="container" />
</template>

<style lang="scss" scoped>
.container {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
