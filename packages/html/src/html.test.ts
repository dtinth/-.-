import { html, renderHtml } from './html'

it('converts strings', async () => {
  expect(renderHtml('meow')).toBe('meow')
})

it('converts numbers', async () => {
  expect(renderHtml(42)).toBe('42')
})

it('converts booleans', async () => {
  expect(renderHtml(true)).toBe('true')
  expect(renderHtml(false)).toBe('false')
})

it('escapes strings', async () => {
  expect(renderHtml('<b>')).toBe('&lt;b&gt;')
})

it('does not escape tagged hypertext', async () => {
  expect(renderHtml(html`<br />`)).toBe('<br />')
})

it('concatenates arrays', async () => {
  expect(renderHtml(['one', 'two', 'three'])).toBe('onetwothree')
})

it('escapes interpolated values', async () => {
  expect(renderHtml(html`<${'<>'}></${'<>'}>`)).toBe('<&lt;&gt;></&lt;&gt;>')
})

it('renders null as an empty string', async () => {
  expect(renderHtml(html`${null}`)).toBe('')
})

it('renders undefined as an empty string', async () => {
  expect(renderHtml(html`${undefined}`)).toBe('')
})

it('keeps hypertext as is', async () => {
  const a = html`<>`
  expect(renderHtml(html`${a}`)).toBe('<>')
})

it('renders __html properties as is', async () => {
  expect(renderHtml({ __html: '<>' })).toBe('<>')
})