<script lang="ts" setup>
import { useAppColor } from '@/composables/useAppColor'
import DefaultBar from './AppBar.vue'

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
