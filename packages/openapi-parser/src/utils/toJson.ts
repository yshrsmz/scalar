import type { AnyObject } from '../types'

export const toJson = (value: AnyObject | undefined) =>
  JSON.stringify(value, null, 2)
