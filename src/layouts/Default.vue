<script lang="ts" setup>
import DefaultBar from './AppBar.vue'
import { useAppColor } from '@/composables/useAppColor'

const { styleVars } = useAppColor()
</script>

<template>
  <v-app :style="styleVars">
    <v-main>
      <DefaultBar />
      <router-view />
    </v-main>
  </v-app>
</template>
