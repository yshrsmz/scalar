import { parseLocalStorage } from '@/migrations/parse-local-storage'
import type { v_0_0_0 } from '@/migrations/v-0.0.0/types.generated'

import type { v_2_1_0 } from './types.generated'

/** V-0.0.0 to V-2.1.0 migration */
export const migrate_v_2_1_0 = (data: Omit<v_0_0_0.Data, 'folders'>) => {
  // Augment the previous data
  const prev = {
    ...data,
    // @ts-expect-error Tags used to be called folders
    folders: parseLocalStorage('folder'),
  } satisfies v_0_0_0.Data

  const collections = prev.collections.map((c) => {
    console.log(c)
    return {
      type: 'collection',
      openapi: c.spec?.openapi,
      info: c.spec?.info,
      security: c.spec?.security,
      externalDocs: c.spec?.externalDocs,
      uid: c.uid,
    } satisfies v_2_1_0.Collection
  })

  return {
    collections,
    cookies: [],
    environments: [],
    requestExamples: [],
    requests: [],
    securitySchemes: [],
    servers: [],
    tags: [],
    workspaces: [],
  } satisfies v_2_1_0.Data
}
