import escape from 'lodash.escape'

/**
 * Use the `html` template tag to safely generate HTML.
 * It returns a `Hypertext` object.
 * You can use the `toHtml` method to get the HTML code.
 * Interpolated values are escaped unless they are
 * @public
 */
export function html(
  strings: TemplateStringsArray,
  ...values: any[]
): Hypertext {
  return new Hypertext(
    strings.reduce(
      (acc, str, i) => acc + Hypertext.from(values[i - 1]).toHtml() + str,
    ),
  )
}

/**
 * The `Hypertext` class is used to represent HTML code.
 * @public
 */
export class Hypertext {
  /**
   * @internal
   */
  constructor(private __html: string) {}

  /**
   * Create a `Hypertext` object from a value.
   *
   * If the value is a string, it is escaped.
   * If the value is an array, it is recursively converted to HTML.
   * If the value is an object with a `__html` property, it is used as is.
   * If the value is `null` or `undefined`, it is converted to an empty string.
   * Otherwise, it is converted to a string and escaped.
   */
  static from(html: any): Hypertext {
    if (Array.isArray(html)) {
      return new Hypertext(html.map((x) => Hypertext.from(x).toHtml()).join(''))
    } else if (typeof html === 'string') {
      return new Hypertext(escape(html))
    } else if (html == null) {
      return new Hypertext('')
    } else if (html instanceof Hypertext) {
      return html
    } else if (html.__html) {
      return new Hypertext(html.__html)
    } else {
      return new Hypertext(escape(String(html)))
    }
  }

  /**
   * Get the HTML code.
   */
  toHtml() {
    return this.__html
  }
}

/**
 * The `Html` type represents anything that can be converted to HTML.
 * Use this type in your functions to accept HTML code.
 */
export type Html =
  | Hypertext
  | { __html: string }
  | string
  | number
  | boolean
  | Html[]

/**
 * Convert a value to HTML.
 */
export function renderHtml(html: Html): string {
  return Hypertext.from(html).toHtml()
}