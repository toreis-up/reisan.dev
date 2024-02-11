<script lang="ts">
import { defineComponent } from 'vue'
import PhaserContainer from './PhaserContainer.vue'

export default defineComponent({
  name: 'GameContainer',
  components: {
    PhaserContainer,
  },
})
</script>

<template>
  <Suspense>
    <PhaserContainer />

    <template #fallback>
      <div>
        loading...
      </div>
    </template>
  </Suspense>
</template>
