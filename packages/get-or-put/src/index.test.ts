import { getOrPut } from '.'
import { it, expect } from 'vitest'

it('returns the value if it exists', () => {
  const map = new Map([['foo', 42]])
  expect(getOrPut(map, 'foo', () => -1)).toBe(42)
})

it('returns the default value if it does not exist', () => {
  const map = new Map()
  expect(getOrPut(map, 'foo', () => -1)).toBe(-1)
})

it('works with a weak map', () => {
  const map = new WeakMap<object, string>()
  const key1 = {}
  const key2 = {}
  map.set(key1, 'foo')
  expect(getOrPut(map, key1, () => 'bar')).toBe('foo')
  expect(getOrPut(map, key2, () => 'bar')).toBe('bar')
})
