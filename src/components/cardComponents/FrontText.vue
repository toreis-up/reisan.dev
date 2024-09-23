<script lang="ts" setup>
import { Text3D } from '@tresjs/cientos'
import { computed } from 'vue'

interface Props {
  position: Array<number>
  text: string
  color?: string
  fontSize?: number
}

const {
  position,
  text,
  color = 'black',
  fontSize,
} = defineProps<Props>()

const computedFontSize = computed(() => {
  return fontSize ? fontSize / 32 : undefined
})
</script>

<template>
  <Text3D
    :position="position"
    :text="text"
    font="fonts/Inter_Regular.json"
    :bevel-enabled="false"
    bevel-segments="1"
    :bevel-thickness="0.01"
    :bevel-offset="0.06"
    :size="computedFontSize"
    height="0.01"
    center
  >
    <TresMeshMatcapMaterial :color="color" />
  </Text3D>
</template>
