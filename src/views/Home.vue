<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { useColor } from '@/composables/useColor'
import { useAppColor } from '@/composables/useAppColor'
import UiHomeCard from '@/components/ui/homeCard.vue'

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
  <v-container class="mb-6 align-center justify-center d-flex main-container">
    <v-row>
      <v-col :sm="6" :cols="12">
        <UiHomeCard />
      </v-col>

      <v-col :sm="6" :cols="12">
        <v-row>
          <v-col>
            <v-btn variant="outlined" to="/portfolio">
              ぽとふぉいく
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn variant="outlined" to="/card">
              3D名刺（笑）を見る
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.main-container {
  height: calc(100vh - 64px);
}
</style>
