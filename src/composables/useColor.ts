import chroma from 'chroma-js'
import hello from 'hello-color'
import { onMounted, ref } from 'vue'

export function useColor() {
  const color = ref('#000000')
  const backgroundColor = ref('#ffffff')

  onMounted(() => {
    const c = chroma.random()
    const result = hello(c.hex(), {
      saturation: 1 / 8,
      contrast: 4,
      hues: 5,
    })

    color.value = result.color
    backgroundColor.value = result.base
  })

  return { color, backgroundColor }
}
