import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
}, {
  rules: {
    'node/prefer-global/process': [ 'error' | 'off']
  }
})
