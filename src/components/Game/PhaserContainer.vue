<template>
  <div :id="containerId" class="container" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { boot } from './phasercore/main'
import { usePhaserStore } from '@/store/phaser';

const phaserStore = usePhaserStore();

export default defineComponent({
  name: 'phaser-container',
  props: {
    containerId: {
      type: String,
      default: () => 'phaser-container'
    }
  },
  mounted() {
    console.log('Hi! Its loaded!')
    if (this.gameInstance == null) {
      let newGameInstance = boot(this.containerId);
      phaserStore.setGameInstance(newGameInstance);
    }
  },
  created() {
    this.gameInstance = phaserStore.gameInstance;
  },
  data () {
    return {
      gameInstance: null as Phaser.Game | null
    }
  }
});
</script>
<style lang="scss" scoped>
.container {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
