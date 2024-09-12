import { stringify } from 'yaml'

import type { AnyObject } from '../types'

export const toYaml = (value: AnyObject | undefined) => stringify(value)
