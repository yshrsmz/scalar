import type { LS_KEYS } from '@/helpers'
import { parse } from 'flatted'

/**
 * Supports pre-flatted local storage
 */
export const parseLocalStorage = (
  lsKey: (typeof LS_KEYS)[keyof typeof LS_KEYS],
) => {
  const item = localStorage.getItem(lsKey) || '[{}]'
  const data = item[0] === '[' ? parse(item) : JSON.parse(item)

  return Object.values(data)
}
