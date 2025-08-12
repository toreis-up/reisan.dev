<script lang="ts" setup>
import { usePhaserStore } from '@/store/phaser'
import { useAppColor } from '@/composables/useAppColor'

const phaserStore = usePhaserStore()
function openLicense() {
  const currentScenes = phaserStore.gameInstance?.scene.getScenes()
  if (currentScenes)
    currentScenes[0].input.emit('ENTER_LICENSE')
}

const { styleVars } = useAppColor()
</script>

<template>
  <v-app-bar :style="styleVars" flat>
    <v-app-bar-title>
      toreis desu
    </v-app-bar-title>
    <template #append>
      <v-btn icon href="https://github.com/toreis-up/portfolio-front" target="_blank">
        <v-icon size="x-large">
          mdi-github
        </v-icon>
      </v-btn>
      <v-tooltip v-if="$route.meta.showLicense">
        <template #[`activator`]="{ props }">
          <v-btn v-bind="props" icon @click="openLicense">
            <v-icon size="x-large">
              mdi-note-check
            </v-icon>
          </v-btn>
        </template>
        <span>ライセンス</span>
      </v-tooltip>
    </template>
  </v-app-bar>
</template>
