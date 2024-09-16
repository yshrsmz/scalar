import { parseLocalStorage } from '@/migrations/parse-local-storage'
import { semverLessThan } from '@/migrations/semver'
import { migrate_v_2_1_0 } from '@/migrations/v-2.1.0'

/** Handles all data migrations per entity */
export const migrator = (dataVersion: string) => {
  // First we gather all of the old data
  let data = {
    collections: parseLocalStorage('collection'),
    cookies: parseLocalStorage('cookie'),
    environments: parseLocalStorage('environment'),
    requestExamples: parseLocalStorage('requestExample'),
    requests: parseLocalStorage('request'),
    securitySchemes: parseLocalStorage('securityScheme'),
    servers: parseLocalStorage('server'),
    tags: parseLocalStorage('tag'),
    workspace: parseLocalStorage('workspace'),
  }

  // 0.0.0 -> 2.1.0 migration
  // Doesn't require data as its the first migration
  if (semverLessThan(dataVersion, '2.1.0')) data = migrate_v_2_1_0(data)

  return data
}
