/**
 * Lazily validate environment variables.
 * @packageDocumentation
 */
import type { ZodError, ZodTypeAny, z } from 'zod'

/**
 * Returns a proxy object that validates environment variables on access.
 *
 * @remarks
 *  Validation is done the first time an environment variable is accessed.
 *  Environment variables that is not used at runtime will not be validated.
 *
 * @param spec - A map of environment variable names to Zod schemas.
 * @param source - The object to source the environment variables from.
 * @returns An object that returns the parsed values when accessed.
 * @public
 */
export function Env<T extends ZodTypeAny>(
  spec: T,
  source: object = process.env,
): z.infer<T> & { valid: boolean; error?: Error; validate: () => z.infer<T> } {
  let result: { value: z.infer<T> } | undefined
  const getResult = () => {
    if (!result) {
      try {
        result = { value: spec.parse(source) }
      } catch (error: unknown) {
        if (isZodError(error)) {
          throw new EnvError(error)
        }
        throw error
      }
    }
    return result.value
  }
  return new Proxy(source, {
    get(_target, prop) {
      switch (prop) {
        case 'validate':
          return getResult
        case 'valid':
          try {
            getResult()
            return true
          } catch {
            return false
          }
        case 'error':
          try {
            getResult()
            return undefined
          } catch (error) {
            return error
          }
        default:
          return getResult()[prop as keyof z.infer<T>]
      }
    },
  }) as any
}

function isZodError(e: any): e is ZodError {
  return Array.isArray(e.issues)
}

/**
 * @public
 */
export class EnvError extends Error {
  constructor(cause: ZodError) {
    super(formatZodError(cause), { cause })
    this.name = 'EnvError'
    this.cause = cause
  }
}

/**
 * @internal
 */
export function formatZodError(error: ZodError): string {
  return error.issues
    .map((issue) => {
      const path = ['env', ...issue.path].join('.')
      return `${path}: ${issue.message} (${issue.code})`
    })
    .join(', ')
}
