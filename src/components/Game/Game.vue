<template>
  <Suspense>
    <phaser-container />

    <template #fallback>
      <div>
        loading...
      </div>
    </template>
  </Suspense>
</template>

<script lang="ts">
import PhaserContainer from './PhaserContainer.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'game-container',
  components: {
    PhaserContainer
  }
})
</script>