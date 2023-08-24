export abstract class ApplicationError<TCode extends string> extends Error {
  public readonly code: TCode

  constructor(code: TCode, ...args: ErrorConstructorArgs) {
    super(...args)
    this.code = code
    this.name =
      (this.constructor as { name?: string }).name || 'ApplicationError'
  }
}

export type ErrorConstructorArgs = ErrorConstructor extends {
  new (...args: infer T): any
}
  ? T
  : never

export function defineApplicationError<TCode extends string>(
  code: TCode,
  options: {
    defaultMessage?: string
  } = {},
): ApplicationErrorConstructor<TCode> {
  const { defaultMessage = code } = options
  return class extends ApplicationError<TCode> {
    constructor(...args: ErrorConstructorArgs) {
      super(code, ...args)
      if (!this.message) {
        this.message = defaultMessage
      }
    }
  }
}

export type ApplicationErrorConstructor<TCode extends string> = new (
  ...args: ErrorConstructorArgs
) => ApplicationError<TCode>
