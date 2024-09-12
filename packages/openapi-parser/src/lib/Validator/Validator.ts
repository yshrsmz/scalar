import Ajv04, { type ErrorObject } from 'ajv-draft-04'
import addFormats from 'ajv-formats'
import Ajv2020 from 'ajv/dist/2020.js'

import {
  ERRORS,
  OpenApiSpecifications,
  type OpenApiVersion,
  OpenApiVersions,
} from '../../configuration'
import type {
  AnyObject,
  Filesystem,
  ThrowOnErrorOption,
  ValidateResult,
} from '../../types'
import { details as getOpenApiVersion } from '../../utils/details'
import { resolveReferences } from '../../utils/resolveReferences'
import { transformErrors } from '../../utils/transformErrors'

/**
 * Configure available JSON Schema versions
 */
export const jsonSchemas = {
  'http://json-schema.org/draft-04/schema#': Ajv04,
  'https://json-schema.org/draft/2020-12/schema': Ajv2020,
}

export class Validator {
  public version: '2.0' | '3.0' | '3.1' | undefined

  public static supportedVersions = OpenApiVersions

  // Object with function *or* object { errors: string }
  protected ajvValidators: Partial<
    Record<
      OpenApiVersion,
      ((specification: AnyObject) => boolean) & {
        errors?:
          | ErrorObject<string, Record<string, any>, unknown>[]
          | null
          | undefined
      }
    >
  > = {}

  protected specificationVersion: string | undefined

  protected specificationType: string | undefined

  public specification: AnyObject | undefined

  /**
   * Checks whether a specification is valid and all references can be resolved.
   */
  async validate(
    filesystem: Filesystem,
    options?: ThrowOnErrorOption,
  ): Promise<ValidateResult> {
    const entrypoint = filesystem.find((file) => file.isEntrypoint)
    const specification = entrypoint?.specification

    if (!entrypoint || !specification) {
      if (options?.throwOnError) {
        throw new Error(ERRORS.NO_CONTENT)
      }

      return {
        valid: false,
        errors: transformErrors({}, ERRORS.NO_CONTENT),
      }
    }

    // TODO: How does this work with a filesystem?
    this.specification = specification

    // TODO: defaulting info.version to keep parser compatible with the previous one
    // we should bubble this error up and not throw on it
    if (this.specification?.info && !this.specification.info.version) {
      this.specification.info.version = '0.0.1'
    }

    try {
      // AnyObject is empty or invalid
      if (specification === undefined || specification === null) {
        if (options?.throwOnError) {
          throw new Error(ERRORS.EMPTY_OR_INVALID)
        }

        return {
          valid: false,
          errors: transformErrors(entrypoint, ERRORS.EMPTY_OR_INVALID),
        }
      }

      // Meta data about the specification
      const { version, specificationType, specificationVersion } =
        getOpenApiVersion(specification)

      this.version = version
      this.specificationVersion = specificationVersion
      this.specificationType = specificationType

      // AnyObject is not supported
      if (!version) {
        if (options?.throwOnError) {
          throw new Error(ERRORS.OPENAPI_VERSION_NOT_SUPPORTED)
        }

        return {
          valid: false,
          errors: transformErrors(
            entrypoint,
            ERRORS.OPENAPI_VERSION_NOT_SUPPORTED,
          ),
        }
      }

      // Get the correct OpenAPI validator
      const validateSchema = await this.getAjvValidator(version)
      const schemaResult = validateSchema(specification)

      // Error handling
      if (validateSchema.errors) {
        if (validateSchema.errors.length > 0) {
          if (options?.throwOnError) {
            throw new Error(validateSchema.errors[0])
          }

          return {
            valid: false,
            errors: transformErrors(entrypoint, validateSchema.errors),
          }
        }
      }

      // Check if the references are valid
      const resolvedReferences = resolveReferences(filesystem, options)

      return {
        valid: schemaResult && resolvedReferences.valid,
        errors: [...(schemaResult.errors ?? []), ...resolvedReferences.errors],
        schema: resolvedReferences.schema,
      }
    } catch (error: any) {
      // Something went horribly wrong!
      if (options?.throwOnError) {
        throw error
      }

      return {
        valid: false,
        errors: transformErrors(entrypoint, error.message ?? error),
      }
    }
  }

  /**
   * Ajv JSON schema validator
   */
  async getAjvValidator(version: OpenApiVersion) {
    // Schema loaded already
    if (this.ajvValidators[version]) {
      return this.ajvValidators[version]
    }

    // Load OpenAPI Schema
    const schema = OpenApiSpecifications[version]

    // Load JSON Schema
    const jsonSchemaVersion = schema.$schema as keyof typeof jsonSchemas
    const AjvClass = jsonSchemas[jsonSchemaVersion]

    // Get the correct Ajv validator
    const ajv = new AjvClass({
      // Ajv is a bit too strict in its strict validation of OpenAPI schemas.
      // Switch strict mode off.
      strict: false,
    })

    // Register formats
    // https://ajv.js.org/packages/ajv-formats.html#formats
    addFormats(ajv)

    // OpenAPI 3.1 uses media-range format
    if (version === '3.1') {
      ajv.addFormat('media-range', true)
    }

    const validator = ajv.compile(schema)

    this.ajvValidators[version] = validator

    return validator
  }
}
