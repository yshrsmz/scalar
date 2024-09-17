import { cookieSchema } from '@/entities/cookie'
import { environmentSchema } from '@/entities/environment'
import {
  collectionSchema,
  requestExampleSchema,
  requestSchema,
  securitySchemeSchema,
  serverSchema,
} from '@/entities/spec'
import { tagSchema } from '@/entities/spec/spec-objects'
import { workspaceSchema } from '@/entities/workspace'
import { writeFile } from 'fs'
import { createTypeAlias, printNode, zodToTs } from 'zod-to-ts'

console.warn(
  'Make sure the generate types file is updated for the current version',
)
console.info('Generating...')

/** Ensure we update this every migration */
const VERSION = '2.1.0'

const entities = [
  { identifier: 'Collection', schema: collectionSchema },
  { identifier: 'Cookie', schema: cookieSchema },
  { identifier: 'Environment', schema: environmentSchema },
  { identifier: 'Tag', schema: tagSchema },
  { identifier: 'RequestExample', schema: requestExampleSchema },
  { identifier: 'Request', schema: requestSchema },
  { identifier: 'SecurityScheme', schema: securitySchemeSchema },
  { identifier: 'Server', schema: serverSchema },
  { identifier: 'Workspace', schema: workspaceSchema },
]

/**
 * Export the types in a namespace
 * TODO:
 * - go back to typescript compiler api and print pretty types as these ones are optional
 */
let typeString = entities.reduce(
  (prev, { identifier, schema }) => {
    const { node } = zodToTs(schema, identifier)
    const typeAlias = createTypeAlias(node, identifier)
    const nodeString = 'export ' + printNode(typeAlias) + '\n\n'
    return prev + nodeString
  },
  `export namespace v_${VERSION.replace(/\./g, '_')} {\n`,
)

// Add all types data object
typeString += `export type Data = { 
  collections: Collection[]
  cookies: Cookie[]
  environments: Environment[]
  requestExamples: RequestExample[]
  requests: Request[]
  securitySchemes: SecurityScheme[]
  servers: Server[]
  tags: Tag[]
  workspaces: Workspace[]
}
}
`

// Write to file
writeFile(
  __dirname + `/v-${VERSION}/types.generated.ts`,
  typeString,
  { flag: 'w' },
  (err) => (err ? console.error(err) : console.log('Generation complete!')),
)
