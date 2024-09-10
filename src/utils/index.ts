class BiDirectionalMap<K, V> {
  private keyToValue = new Map<K, V>()
  private valueToKey = new Map<V, K>()

  set(key: K, value: V): this {
    this.keyToValue.set(key, value)
    this.valueToKey.set(value, key)
    return this
  }

  getByKey(key: K): V | undefined {
    return this.keyToValue.get(key)
  }

  getByValue(value: V): K | undefined {
    return this.valueToKey.get(value)
  }
}

export { BiDirectionalMap }
