import {
  getLocalStorageVersion,
  parseLocalStorage,
} from '@/migrations/local-storage'
import { semverLessThan } from '@/migrations/semver'
import { migrate_v_2_1_0, type v_2_1_0 } from '@/migrations/v-2.1.0'

/** Handles all data migrations per entity */
export const migrator = () => {
  const dataVersion = getLocalStorageVersion()
  console.info('Data version: ' + dataVersion)

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
    workspaces: parseLocalStorage('workspace'),
  } as any

  // 0.0.0 -> 2.1.0 migration
  if (semverLessThan(dataVersion, '2.1.0')) data = migrate_v_2_1_0(data)

  return data as v_2_1_0.Data
}
