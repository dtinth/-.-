export type Result<T, E extends Error = Error> = Ok<T> | Err<E>

export interface Ok<T> {
  ok: true
  value: T
  reason?: undefined
}

export interface Err<E extends Error> {
  ok: false
  reason: E
  value?: undefined
}

export function Ok<T>(value: T): Ok<T> {
  return { ok: true, value }
}

export function Err<E extends Error>(reason: E): Err<E> {
  return { ok: false, reason }
}
