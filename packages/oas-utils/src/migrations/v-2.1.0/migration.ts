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
  } as v_0_0_0.Data

  const collections = prev.collections.map(
    (c) =>
      ({
        type: 'collection',
        openapi: c.spec?.openapi,
        info: c.spec?.info,
        security: c.spec?.security,
        externalDocs: c.spec?.externalDocs,
        uid: c.uid,
        securitySchemes: Object.values(c.securitySchemeDict ?? {}),
        selectedServerUid: c.selectedServerUid,
        servers: c.spec?.serverUids,
        // TODO grab request UIDs
        // requests
        // tags
        // auth
        children: c.childUids,
      }) satisfies v_2_1_0.Collection,
  )

  const cookies = prev.cookies satisfies v_2_1_0.Cookie[]

  const environments = prev.environments.map(
    (e) =>
      ({
        uid: e.uid,
        name: e.name,
        color: e.color,
        isDefault: e.isDefault,
        value: '',
      }) satisfies v_2_1_0.Environment,
  )

  const requests = prev.requests.map((r) => {
    // Convert parameters
    const parameters: v_2_1_0.Request['parameters'] = [
      ...Object.values(r.parameters?.path ?? {}),
      ...Object.values(r.parameters?.query ?? {}),
      ...Object.values(r.parameters?.headers ?? {}),
      ...Object.values(r.parameters?.cookies ?? {}),
    ].filter((p) => p)

    return {
      tags: r.tags,
      summary: r.summary,
      description: r.description,
      operationId: r.operationId,
      security: r.security,
      requestBody: r.requestBody,
      parameters,
    } satisfies v_2_1_0.Request
  })

  const servers = prev.servers.map(
    (s) =>
      ({
        ...s,
        variables: s.variables ?? {},
      }) satisfies v_2_1_0.Server,
  )

  const tags = prev.folders.map(
    (f) =>
      ({
        type: 'tag',
        uid: f.uid,
        name: f.name || 'unknownTag',
        description: f.description,
        children: f.childUids,
      }) satisfies v_2_1_0.Tag,
  )

  const workspaces = prev.workspaces.map(
    (w) =>
      ({
        ...w,
        cookies: w.cookieUids,
        collections: w.collectionUids,
        environments: w.environmentUids,
      }) satisfies v_2_1_0.Workspace,
  )

  return {
    collections,
    cookies,
    environments,
    requestExamples: [],
    requests,
    securitySchemes: [],
    servers,
    tags,
    workspaces,
  }
}
