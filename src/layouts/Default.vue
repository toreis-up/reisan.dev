<script lang="ts" setup>
import DefaultBar from './AppBar.vue'
</script>

<template>
  <v-app>
    <v-main>
      <DefaultBar />
      <router-view />
    </v-main>
  </v-app>
</template>
