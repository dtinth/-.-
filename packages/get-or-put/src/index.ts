export interface MapLike<K, V> {
  has(key: K): boolean
  get(key: K): V | undefined
  set(key: K, value: V): void
}

export function getOrPut<K, V>(
  map: MapLike<K, V>,
  key: K,
  defaultValue: () => V,
): V {
  if (map.has(key)) {
    return map.get(key)!
  }

  const value = defaultValue()
  map.set(key, value)
  return value
}
