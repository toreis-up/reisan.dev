<template>
  <v-app>
    <default-bar />

    <default-view class="view"/>
  </v-app>
</template>

<script lang="ts" setup>
  import DefaultBar from './AppBar.vue'
  import DefaultView from './View.vue'
</script>

<style lang="scss" scoped>
.view {
    height: calc(100vh - 64px);
  }
</style>
