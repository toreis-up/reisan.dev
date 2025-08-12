<script lang="ts" setup>
import { OrbitControls, Stars } from '@tresjs/cientos'
import { TresCanvas } from '@tresjs/core'
import { computed, shallowRef } from 'vue'
import cardInfo from '../../public/card/card.json'
import BackText from './cardComponents/BackText.vue'
import Base from './cardComponents/Base.vue'
import FrontText from './cardComponents/FrontText.vue'

const frontwardRef = shallowRef()
const backwardRef = shallowRef()

const intervalId = setInterval(() => {
  if (backwardRef.value) {
    clearInterval(intervalId)
    backwardRef.value.rotation.y = Math.PI
  }
}, 1)

const autoRotate = computed(() => {
  return process.env.NODE_ENV !== 'development'
})
</script>

<template>
  <TresCanvas window-size clear-color="#1B263B">
    <TresPerspectiveCamera :position="[0, 0, 20]" :look-at="[0, 0, 0]" />
    <Stars
      :size="0.5"
      :size-attenuation="true"
    />
    <OrbitControls
      :enable-zoom="false"
      :auto-rotate="autoRotate"
    />
    <TresAmbientLight
      color="#ffffff"
    />
    <TresGroup>
      <Base />
    </TresGroup>
    <Suspense>
      <TresGroup>
        <TresGroup ref="frontwardRef">
          <FrontText
            v-for="(card, idx) in cardInfo.front"
            :key="idx"
            :position="card.position"
            :text="card.text"
            :font-size="card.fontSize"
          />
        </TresGroup>
        <TresGroup ref="backwardRef">
          <BackText
            v-for="(card, idx) in cardInfo.back"
            :key="idx"
            :position="card.position"
            :text="card.text"
            :font-size="card.fontSize"
          />
        </TresGroup>
      </TresGroup>
    </Suspense>
  </TresCanvas>
</template>
