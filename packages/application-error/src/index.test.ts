import { defineApplicationError } from '.'
import { it, expect } from 'vitest'

const FooError = defineApplicationError('FooError')
const BarError = defineApplicationError('BarError')

// function someFunction() {
//   if (Math.random() < 0.5) return new FooError('some foo error')
//   if (Math.random() < 0.5) return new BarError('some bar error')
//   return 42
// }

it('has a code property', () => {
  const err = new FooError('some foo error')
  expect(err.code).toBe('FooError')
})

it('has a name property', () => {
  const err = new FooError('some foo error')
  expect(err.name).toBe('ApplicationError')
})

it('has a message property', () => {
  const err = new FooError('some foo error')
  expect(err.message).toBe('some foo error')
})

it('allow setting a default message', () => {
  const err = new FooError()
  expect(err.message).toBe('FooError')
})

it('allow setting a default message to a custom value', () => {
  const MyError = defineApplicationError('MyError', {
    defaultMessage: 'some default message',
  })
  const err = new MyError()
  expect(err.message).toBe('some default message')
})

it('supports cause', () => {
  const cause = new BarError()
  const err = new FooError('some foo error', { cause })
  expect(err.cause).toBe(cause)
})
