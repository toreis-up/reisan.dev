import { computed, ref } from 'vue'

const color = ref<string | null>(null)
const bgColor = ref<string | null>(null)

function hexToTriplet(hex: string) {
  const s = hex.replace('#', '')
  const v
    = s.length === 3
      ? s.split('').map(c => Number.parseInt(c + c, 16))
      : [s.slice(0, 2), s.slice(2, 4), s.slice(4, 6)].map(h =>
          Number.parseInt(h, 16),
        )
  return `${v[0]},${v[1]},${v[2]}`
}

function anyToTriplet(input: string) {
  if (input.startsWith('#'))
    return hexToTriplet(input)
  if (input.startsWith('rgb('))
    return input.slice(4, -1)
  if (input.startsWith('rgba(')) {
    const [r, g, b] = input
      .slice(5, -1)
      .split(',')
      .map(s => s.trim())
      .slice(0, 3)
    return `${r}, ${g}, ${b}`
  }

  return input
}

export function useAppColor() {
  const styleVars = computed<Record<string, string>>(() => {
    const vars: Record<string, string> = {}
    if (bgColor.value) {
      vars['--v-theme-background'] = anyToTriplet(bgColor.value)
      vars['--v-theme-surface'] = anyToTriplet(bgColor.value)
    }
    if (color.value) {
      vars['--v-theme-on-background'] = anyToTriplet(color.value)
      vars['--v-theme-on-surface'] = anyToTriplet(color.value)
    }
    return vars
  })

  return {
    color,
    bgColor,
    setBg: (val: string | null) => (bgColor.value = val),
    setColor: (val: string | null) => (color.value = val),
    styleVars,
  }
}
