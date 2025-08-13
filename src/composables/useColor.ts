import chroma from 'chroma-js'
import hello from 'hello-color'
import { onMounted, ref } from 'vue'

export function useColor(safeColor = true) {
  const color = ref('#000000')
  const backgroundColor = ref('#ffffff')

  function isSafe(hexString: string) {
    const [_, a, b] = chroma(hexString).lab()
    const C = Math.hypot(a, b)
    return (C <= 70);
  }

  function randomSafeLCh({
  Lrange = [30, 80],
  Crange = [0, 70],
  huerange = [0, 360],
} = {}) {
  const L = Lrange[0] + Math.random() * (Lrange[1] - Lrange[0]);
  const C = Crange[0] + Math.random() * (Crange[1] - Crange[0]);
  const h = huerange[0] + Math.random() * (huerange[1] - huerange[0]);
  return chroma.lch(L, C, h).hex();
}

  onMounted(() => {
    const base = chroma(randomSafeLCh());
    let result;

    do {
      result = hello(base.hex(), {
        saturation: 1 / 24,
        contrast: 4.5,
        hues: 5,
      })
      if (!safeColor)
        break;
    } while (!isSafe(result.color))

    color.value = result.color
    backgroundColor.value = result.base
  })

  return { color, backgroundColor }
}
