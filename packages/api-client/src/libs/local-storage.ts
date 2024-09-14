import type { useWorkspace } from '@/store'
import { LS_KEYS } from '@/store/local-storage'
import { migrator } from '@scalar/oas-utils/migrations'

/**
 * Loads all resources from localStorage and applies any migrations, then loads into mutators
 * We use the raw mutator.add here instead of the custom ones because we do NOT want any side effects
 *
 * Currently not working for workspace
 */
export const loadAllResources = (mutators: ReturnType<typeof useWorkspace>) => {
  const {
    collectionMutators,
    cookieMutators,
    environmentMutators,
    tagMutators,
    requestExampleMutators,
    requestMutators,
    serverMutators,
    securitySchemeMutators,
    workspaceMutators,
  } = mutators

  try {
    const appVersion = import.meta.env.PACKAGE_VERSION
    const dataVersion = localStorage.getItem('version') ?? '0.0.0'
    const payload = {
      appVersion,
      dataVersion,
    }

    const collections = migrator(LS_KEYS.COLLECTION, payload)
    collectionMutators.loadLocalStorage(collections)

    const cookies = migrator(LS_KEYS.COOKIE, payload)
    cookieMutators.loadLocalStorage(cookies)

    const environments = migrator(LS_KEYS.ENVIRONMENT, payload)
    environmentMutators.loadLocalStorage(environments)

    const requestExamples = migrator(LS_KEYS.REQUEST_EXAMPLE, payload)
    requestExampleMutators.loadLocalStorage(requestExamples)

    const requests = migrator(LS_KEYS.REQUEST, payload)
    requestMutators.loadLocalStorage(requests)

    const servers = migrator(LS_KEYS.SERVER, payload)
    serverMutators.loadLocalStorage(servers)

    const securitySchemes = migrator(LS_KEYS.SECURITY_SCHEME, payload)
    securitySchemeMutators.loadLocalStorage(securitySchemes)

    const tags = migrator(LS_KEYS.TAG, payload)
    tagMutators.loadLocalStorage(tags)

    const workspaces = migrator(LS_KEYS.WORKSPACE, payload)
    workspaceMutators.loadLocalStorage(workspaces)

    // Set localStorage version for future migrations
    localStorage.setItem('version', import.meta.env.PACKAGE_VERSION)
  } catch (e) {
    console.error(e)
  }
}
