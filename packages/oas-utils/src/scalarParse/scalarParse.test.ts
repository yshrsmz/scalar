import { type ResolvedOpenAPI, openapi } from '@scalar/openapi-parser'
import { describe, expect, test } from 'vitest'

import mega from './mega.yaml'
import { parse } from './parseOld'
import { transformResult } from './scalarParse'

describe('Translates open api spec to data object for rendering', () => {
  test.skip('OLD: Parse openapi 3 spec', async () => {
    const specification = {
      openapi: '3.0.0',
      info: { title: 'Example' },
      paths: {},
    }
    const result = await parse(specification)
    console.log(result)
  })

  test.skip('Parse openapi 3 spec', async () => {
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

    const schema: ResolvedOpenAPI.Document = result.schema

    const transformed = transformResult(structuredClone(schema))

    console.log(transformed)
  })

  test.skip('OLD Parse openapi 3.1 spec with webhooks', async () => {
    const oldresult = await parse(mega)
    console.log(JSON.stringify(oldresult, null, 2))
  })
  test('Parse openapi 3.1 spec with webhooks', async () => {
    const result = await openapi().load(mega).resolve()
    console.log(JSON.stringify(result, null, 2))
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

    const oldresult = await parse(mega)
    // console.log(JSON.stringify(oldresult, null, 2))
    // console.log(JSON.stringify(transformed, null, 2))

    expect(transformed).toStrictEqual(oldresult)

    // @ts-ignore
    expect(transformed.webhooks?.myWebhook?.description?.description).toEqual(
      'Overriding description',
    )
  })
  test('Parse openapi spec with tags', async () => {
    // TODO: render it???
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
  test('Parse openapi 2 spec', async () => {
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
