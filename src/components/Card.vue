<script lang="ts" setup>
import { TresCanvas } from '@tresjs/core'
import { OrbitControls, RoundedBox, Text3D } from '@tresjs/cientos'
import { shallowRef } from 'vue'

const frontwardRef = shallowRef()
const backwardRef = shallowRef()

const intervalId = setInterval(() => {
  if (backwardRef.value) {
    clearInterval(intervalId)
    backwardRef.value.rotation.y = 3.14
  }
}, 1)
</script>

<template>
  <TresCanvas window-size>
    <TresPerspectiveCamera :position="[3, 3, 20]" :look-at="[0, 0, 0]" />
    <OrbitControls
      :enable-zoom="false"
      :auto-rotate="true"
    />
    <RoundedBox :position="[0, 0, 0]" :args="[9.1, 5.5, 0.1, 10, 1]" color="white" />
    <Suspense>
      <TresGroup>
        <TresGroup ref="frontwardRef">
          <Text3D
            :position="[0, 0, 1]"
            text="toreis"
            font="fonts/Inter_Regular.json"
            :bevel-enabled="false"
            :bevel-segments="1"
            center
            height="0.05"
          >
            <TresMeshToonMaterial />
          </Text3D>
        </TresGroup>
        <TresGroup ref="backwardRef">
          <Text3D
            :position="[0, 0, 1]"
            text="aho"
            font="fonts/Inter_Regular.json"
            :bevel-enabled="false"
            :bevel-segments="1"
            center
            height="0.05"
          >
            <TresMeshToonMaterial />
          </Text3D>
        </TresGroup>
      </TresGroup>
    </Suspense>
  </TresCanvas>
</template>
