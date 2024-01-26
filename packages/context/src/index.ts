import { typeid } from 'typeid-js'

export interface BaseContext {
  readonly id: string
}

export function createContext(contextType: string): BaseContext {
  return {
    id: typeid(contextType).toString(),
  }
}
