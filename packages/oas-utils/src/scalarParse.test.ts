import { describe, expect, test } from 'vitest'

import { scalarParse } from './scalarParse'

const basicSpec = {
  openapi: '3.1.0',
  info: { title: 'Example' },
  paths: {},
}

const basicSpecString = JSON.stringify(basicSpec)

describe('Translates open api spec to data object for rendering', () => {
  test('Translates valid spec', async () => {
    const translatedSpec = await scalarParse({
      specConfig: {
        content: basicSpec,
      },
    })

    expect(translatedSpec).toBe(basicSpecString)
  })

  test('Translates malformed spec', async () => {})
})
