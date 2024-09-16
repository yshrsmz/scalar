import type { useWorkspace } from '@/store'
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
    const dataVersion = localStorage.getItem('version') ?? '0.0.0'

    // Hit our local storage data migrator
    const {
      collections,
      cookies,
      environments,
      requestExamples,
      requests,
      servers,
      securitySchemes,
      tags,
      workspaces,
    } = migrator(dataVersion)

    collectionMutators.loadLocalStorage(collections)
    cookieMutators.loadLocalStorage(cookies)
    environmentMutators.loadLocalStorage(environments)
    requestExampleMutators.loadLocalStorage(requestExamples)
    requestMutators.loadLocalStorage(requests)
    serverMutators.loadLocalStorage(servers)
    securitySchemeMutators.loadLocalStorage(securitySchemes)
    tagMutators.loadLocalStorage(tags)
    workspaceMutators.loadLocalStorage(workspaces)

    // Set localStorage version for future migrations
    localStorage.setItem('version', import.meta.env.PACKAGE_VERSION)
  } catch (e) {
    console.error(e)
  }
}
