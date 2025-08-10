<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { useColor } from '@/composables/useColor'
import { useAppColor } from '@/composables/useAppColor'

const { color, backgroundColor } = useColor()
const { setColor, setBg } = useAppColor()

onMounted(() => {
  setBg(backgroundColor.value)
  setColor(color.value)
})

onBeforeUnmount(() => {
  setBg(null)
  setColor(null)
})
</script>

<template>
  <div>
    なにもないったら
  </div>
  <router-link to="/portfolio">
    ぽとふぉいく
  </router-link>
  <br>
  <router-link to="/card">
    3D名刺（笑）を見る
  </router-link>
</template>
