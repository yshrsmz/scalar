import {
  type OpenAPIV2,
  type OpenAPIV3,
  type OpenAPIV3_1,
  type ResolvedOpenAPI,
  type ResolvedOpenAPIV2,
  type ResolvedOpenAPIV3,
  type ResolvedOpenAPIV3_1,
  openapi,
} from '@scalar/openapi-parser'

import {
  type DeepPartial,
  type RemoveUndefined,
  type RequestMethod,
  type Spec,
  validRequestMethods,
} from '../types'

/** Add Tags to the schema if they don’t exist and properly type them */
export const addTagsToSchema = <T extends ResolvedOpenAPI.Document>(
  schema: T,
) => {
  if ('tags' in schema && schema.tags !== undefined && schema.tags !== null) {
    const tags = schema.tags as ResolvedOpenAPI.Document['tags']
    delete schema.tags
    return {
      ...schema,
      paths: tags,
    }
  } else
    return {
      ...schema,
      tags: [] as ResolvedOpenAPI.Document['tags'],
    }
}

/** Add Paths to the schema if they don’t exist and properly type them */
export const addPathsToSchema = <T extends ResolvedOpenAPI.Document>(
  schema: T,
) => {
  if (
    'paths' in schema &&
    schema.paths !== undefined &&
    schema.paths !== null
  ) {
    const paths = schema.paths as Record<
      string,
      | RemoveUndefined<ResolvedOpenAPIV2.PathItemObject>
      | RemoveUndefined<ResolvedOpenAPIV3.PathItemObject>
      | RemoveUndefined<ResolvedOpenAPIV3_1.PathItemObject>
    >

    delete schema.paths
    return {
      ...schema,
      paths: paths,
    }
  } else
    return {
      ...schema,
      paths: {} as Record<
        string,
        | RemoveUndefined<ResolvedOpenAPIV2.PathItemObject>
        | RemoveUndefined<ResolvedOpenAPIV3.PathItemObject>
        | RemoveUndefined<ResolvedOpenAPIV3_1.PathItemObject>
      >,
    }
}

/** Add Webhooks to the schema if they don’t exist and properly type them */
export const addWebhooksToSchema = <T extends ResolvedOpenAPI.Document>(
  schema: T,
) => {
  if (
    'webhooks' in schema &&
    schema.webhooks !== undefined &&
    schema.webhooks !== null
  ) {
    const webhooks = schema.webhooks as Record<
      string,
      ResolvedOpenAPIV3_1.PathItemObject
    >
    delete schema.webhooks
    return {
      ...schema,
      webhooks: webhooks,
    }
  } else
    return {
      ...schema,
      webhooks: {} as Record<string, ResolvedOpenAPIV3_1.PathItemObject>,
    }
}

export const addSchemaProperties = <T extends ResolvedOpenAPI.Document>(
  schema: T,
) => {
  const tagsSchema = addTagsToSchema(schema)
  const pathSchema = addPathsToSchema(tagsSchema)
  const webhooksSchema = addWebhooksToSchema(pathSchema)

  return webhooksSchema
}

/** Transform webhooks data - Return a new webhooks object with the transformed data */
export const transformWebhooks = <T extends ResolvedOpenAPI.Document>(
  schema: T,
  webhooks: Record<string, ResolvedOpenAPIV3_1.PathItemObject> = {},
) => {
  const newWebhooks: Record<string, any> = {}
  Object.keys(webhooks ?? {}).forEach((name) => {
    // prettier-ignore
    ;(

        Object.keys(webhooks[name] ?? {}) as OpenAPIV3_1.HttpMethods[]
      ).forEach((httpVerb) => {
        const originalWebhook =
          (webhooks?.[name] as OpenAPIV3_1.PathItemObject)[httpVerb]

        if (newWebhooks[name] === undefined) {
          newWebhooks[name] = {}
        }

        newWebhooks[name][httpVerb] = {
          // Transformed data
          httpVerb: httpVerb,
          path: name,
          operationId: originalWebhook?.operationId || name,
          name: originalWebhook?.summary || name || '',
          description: originalWebhook?.description || '',
          pathParameters: schema.paths?.[name]?.parameters, // TODO: what if undefined
          // Original webhook
          information: {
            ...originalWebhook,
          },
        }

        // Object.assign(
        //   (schema).webhooks?.[name]?.[httpVerb] ?? {},
        //   {},
        // )
        // Object.assign(
        //   (schema).webhooks?.[name]?.[httpVerb] ?? {},
        //   {},
        // )
        // information: {
        //   ...(schema).webhooks?.[name],
        // },
      })
  })

  return newWebhooks
}

// TODO: more descriptive name
/** Transform a resolved OpenAPI spec from the OpenAPI Parser for better rendering */
export const transformResult = <TSpec extends ResolvedOpenAPI.Document>(
  schema: TSpec,
): DeepPartial<Spec> => {
  // Validate or instantiate required properties
  const scalarSchema = addSchemaProperties(schema)
  const newWebhooks = transformWebhooks(scalarSchema, scalarSchema.webhooks)

  /** Transform request methods, operations, tags */
  Object.keys(scalarSchema.paths).forEach((path: string) => {
    // TODO: move this to utils?
    // Type helper for object keys
    const objectKeys = <Obj extends object>(obj: Obj): (keyof Obj)[] => {
      return Object.keys(obj) as (keyof Obj)[]
    }

    // for each path, format operation data and add tags or create default tag
    objectKeys(scalarSchema.paths[path]).forEach((requestMethod) => {
      // TODO: check that requestMethod is a valid request method - use extract keys ??
      if (
        validRequestMethods.includes(
          requestMethod.toUpperCase() as RequestMethod,
        )
      ) {
        const operation = scalarSchema.paths[path][
          requestMethod
        ] as ResolvedOpenAPI.Operation

        // Transform the operation
        const newOperation = {
          httpVerb: requestMethod,
          path,
          operationId: operation.operationId || path,
          name: operation.summary || path || '',
          description: operation.description || '',
          information: {
            ...operation,
          },
          pathParameters: scalarSchema.paths?.[path]?.parameters,
        }

        // If there are no tags, we’ll create a default one.
        if (!operation.tags || operation.tags.length === 0) {
          // Create the default tag.
          if (
            !scalarSchema?.tags?.find(
              (
                tag:
                  | OpenAPIV2.TagObject
                  | OpenAPIV3.TagObject
                  | OpenAPIV3_1.TagObject,
              ) => tag.name === 'default',
            )
          ) {
            scalarSchema.tags?.push({
              name: 'default',
              description: '',
              operations: [], // TODO: add to type definition
            })
          }

          // find the index of the default tag
          const indexOfDefaultTag =
            scalarSchema.tags?.findIndex(
              (
                tag:
                  | OpenAPIV2.TagObject
                  | OpenAPIV3.TagObject
                  | OpenAPIV3_1.TagObject,
              ) => tag.name === 'default',
            ) ?? -1

          // Add the new operation to the default tag.
          if (indexOfDefaultTag >= 0) {
            // Add the new operation to the default tag.
            scalarSchema.tags[indexOfDefaultTag]?.operations.push(newOperation)
          }
        }
        // If the operation has tags, loop through them.
        else {
          operation.tags.forEach((operationTag: string) => {
            // Try to find the tag in the schema
            const indexOfExistingTag = scalarSchema.tags?.findIndex(
              (tag: SwaggerTag) => tag.name === operationTag,
            )

            // Create tag if it doesn’t exist yet
            if (indexOfExistingTag === -1) {
              scalarSchema.tags?.push({
                name: operationTag,
                description: '',
              })
            }

            // Decide where to store the new operation
            const tagIndex =
              indexOfExistingTag !== -1
                ? indexOfExistingTag
                : scalarSchema.tags.length - 1

            // Create operations array if it doesn’t exist yet

            if (
              typeof scalarSchema.tags[tagIndex]?.operations === 'undefined'
            ) {
              scalarSchema.tags[tagIndex].operations = []
            }

            // Add the new operation
            scalarSchema.tags[tagIndex].operations.push(newOperation)
          })
        }
      }
    })
  })

  const returnedResult = {
    ...scalarSchema,
    webhooks: newWebhooks,
  } as unknown as Spec

  return removeTagsWithoutOperations(returnedResult)
}

const removeTagsWithoutOperations = (spec: Spec) => {
  return {
    ...spec,
    tags: spec.tags?.filter((tag) => tag.operations?.length > 0), // TODO: spec.tags?.filter is not a function
  }
}
