<script lang="ts" setup>
import DefaultBar from './AppBar.vue'
import DefaultView from './View.vue'
</script>

<template>
  <v-app>
    <DefaultBar />

    <DefaultView class="view" />
  </v-app>
</template>

<style lang="scss" scoped>
.view {
    height: calc(100vh - 64px);
  }
</style>
