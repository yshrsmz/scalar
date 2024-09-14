import type { useWorkspace } from '@/store'

/**
 * Loads all resources from localStorage into mutators on app start
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

  const previousVersion = localStorage.getItem('version') ?? '0.0.0'
  const currentVersion = import.meta.env.PACKAGE_VERSION

  try {
    collectionMutators.loadLocalStorage(previousVersion, currentVersion)
    cookieMutators.loadLocalStorage(previousVersion, currentVersion)
    environmentMutators.loadLocalStorage(previousVersion, currentVersion)
    tagMutators.loadLocalStorage(previousVersion, currentVersion)
    requestExampleMutators.loadLocalStorage(previousVersion, currentVersion)
    requestMutators.loadLocalStorage(previousVersion, currentVersion)
    serverMutators.loadLocalStorage(previousVersion, currentVersion)
    securitySchemeMutators.loadLocalStorage(previousVersion, currentVersion)
    workspaceMutators.loadLocalStorage(previousVersion, currentVersion)

    // Set localStorage version for future migrations
    localStorage.setItem('version', import.meta.env.PACKAGE_VERSION)
  } catch (e) {
    console.error(e)
    return e
  }
}
