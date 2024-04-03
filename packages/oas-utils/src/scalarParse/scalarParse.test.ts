import {
  type OpenAPIV2,
  type OpenAPIV3,
  type OpenAPIV3_1,
  type ResolvedOpenAPI,
  type ResolvedOpenAPIV3,
  type ResolvedOpenAPIV3_1,
  openapi,
} from '@scalar/openapi-parser'
import { describe, expect, test } from 'vitest'

import mega from './mega.yaml'
import { transformResult } from './scalarParse'

describe('Translates open api spec to data object for rendering', () => {
  test('Parse openapi 3 spec', async () => {
    const specification = {
      openapi: '3.0.0',
      info: { title: 'Example' },
      paths: {},
    }
    const result = await openapi().load(specification).resolve()

    // console.log(JSON.stringify(result, null, 2))

    expect(result.valid).toBe(true)
    expect(result.version).toBe('3.0')
    expect(result.schema).toBeDefined()
    expect(result.errors).toBeUndefined()
    expect(result.specification).toBeDefined()
    expect(result.schema).toStrictEqual(specification)

    if (result.schema === undefined) {
      throw 'Failed to parse the OpenAPI file.'
    }

    // Check the version that openapi parser returns and return the type based on that?

    // Spec is the output type so we probably don't want to use that??
    const schema: ResolvedOpenAPI.Document = result.schema

    const transformed = transformResult(structuredClone(schema))

    console.log(transformed)
  })
  test('Parse openapi 3.1 spec with webhooks', async () => {
    // const result = await openapi().load(specification).resolve()
    const result = await openapi().load(mega).resolve()

    // console.log(JSON.stringify(result, null, 2))

    expect(result.valid).toBe(true)
    expect(result.version).toBe('3.1')
    expect(result.schema).toBeDefined()
    expect(result.errors).toBeUndefined()
    expect(result.specification).toBeDefined()

    if (result.schema === undefined) {
      throw 'Failed to parse the OpenAPI file.'
    }

    const schema: ResolvedOpenAPI.Document = result.schema

    const transformed = transformResult(structuredClone(schema))

    console.log(JSON.stringify(transformed, null, 2))

    // @ts-ignore
    expect(transformed.webhooks?.myWebhook?.description?.description).toEqual(
      'Overriding description',
    )
  })
  test.skip('Parse openapi 2 spec', async () => {
    const specification = {
      openapi: '2.0.0',
      info: { title: 'Example' },
      paths: {},
    }
    const result = await openapi().load(specification).resolve()

    // console.log(JSON.stringify(result, null, 2))

    expect(result.valid).toBe(true)
    expect(result.version).toBe('2.0')
    expect(result.schema).toBeDefined()
    expect(result.errors).toBeUndefined()
    expect(result.specification).toBeDefined()
    expect(result.schema).toStrictEqual(specification)

    if (result.schema === undefined) {
      throw 'Failed to parse the OpenAPI file.'
    }

    // Check the version that openapi parser returns and return the type based on that?

    // Spec is the output type so we probably don't want to use that??
    const schema: ResolvedOpenAPI.Document = result.schema

    const transformed = transformResult(structuredClone(schema))

    console.log(transformed)
  })
})
