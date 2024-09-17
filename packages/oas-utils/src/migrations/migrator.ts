import { parseLocalStorage } from '@/migrations/parse-local-storage'
import { semverLessThan } from '@/migrations/semver'
import { migrate_v_2_1_0, type v_2_1_0 } from '@/migrations/v-2.1.0'
import { parse } from 'flatted'

/** Take a best guess of the data version */
const getVersion = (): string => {
  const collectionStr = localStorage.getItem('collection')
  const dataVersion = localStorage.getItem('version')

  // No flatted means first version
  if (!collectionStr?.length || collectionStr?.[0] === '{') return '0.0.0'

  // Flatted + types means 2.1.0
  try {
    const [collection] = Object.values(
      parse(collectionStr) ?? {},
    ) as v_2_1_0.Collection[]
    if (collection.type === 'collection') return '2.1.0'

    if (dataVersion) return dataVersion
    return '0.0.0'
  } catch (e) {
    console.error(e)

    if (dataVersion) return dataVersion
    return '0.0.0'
  }
}

/** Handles all data migrations per entity */
export const migrator = () => {
  const dataVersion = getVersion()
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
