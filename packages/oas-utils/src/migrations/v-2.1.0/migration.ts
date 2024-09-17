import { parseLocalStorage } from '@/migrations/local-storage'
import type { v_0_0_0 } from '@/migrations/v-0.0.0/types.generated'

import type { v_2_1_0 } from './types.generated'

/** V-0.0.0 to V-2.1.0 migration */
export const migrate_v_2_1_0 = (data: Omit<v_0_0_0.Data, 'folders'>) => {
  console.info('Performing data migration v-0.0.0 to v-2.1.0')

  // Augment the previous data
  const oldData = {
    ...data,
    // @ts-expect-error Tags used to be called folders
    folders: parseLocalStorage('folder'),
  } as v_0_0_0.Data

  /** To grab requests and tags we must traverse children */
  const flattenChildren = (childUids: string[]) =>
    childUids.reduce(
      (prev, uid) => {
        if (oldData.requests[uid]) prev.requests.push(uid)
        else if (oldData.folders[uid]) {
          const { requests, tags } = flattenChildren(
            oldData.folders[uid].childUids ?? [],
          )
          prev.requests.push(...requests)
          prev.tags.push(uid, ...tags)
        }

        return prev
      },
      { requests: [] as string[], tags: [] as string[] },
    )

  // Collections
  const collections = Object.values(oldData.collections ?? {}).map((c) => {
    const { requests, tags } = flattenChildren(c.childUids ?? [])
    console.log(requests)
    console.log(tags)

    const auth = {}
    return {
      type: 'collection',
      openapi: c.spec?.openapi,
      info: c.spec?.info,
      security: c.spec?.security,
      externalDocs: c.spec?.externalDocs,
      uid: c.uid,
      securitySchemes: Object.values(c.securitySchemeDict ?? {}),
      selectedServerUid: c.selectedServerUid,
      servers: c.spec?.serverUids,
      requests,
      tags,
      auth,
      children: c.childUids,
    } satisfies v_2_1_0.Collection
  })

  // Cookies
  const cookies = Object.values(
    oldData.cookies ?? {},
  ) satisfies v_2_1_0.Cookie[]

  // Environments
  const environments = Object.values(oldData.environments ?? {}).map(
    (e) =>
      ({
        uid: e.uid,
        name: e.name,
        color: e.color,
        isDefault: e.isDefault,
        value: '',
      }) satisfies v_2_1_0.Environment,
  )

  // Requests
  const requests = Object.values(oldData.requests ?? {}).map((r) => {
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
      type: 'request',
      uid: r.uid,
      path: r.path,
      method: (r.method?.toLowerCase() as v_2_1_0.Request['method']) ?? 'get',
      examples: r.childUids,
      selectedSecuritySchemeUids: r.selectedSecuritySchemeUids,
    } satisfies v_2_1_0.Request
  })

  // Request Examples
  const requestExamples = Object.values(oldData.requestExamples ?? {}).map(
    (e) =>
      ({
        ...e,
        type: 'requestExample',
      }) satisfies v_2_1_0.RequestExample,
  )

  // Security Schemes
  const securitySchemes = Object.values(
    oldData.securitySchemes ?? {},
  ) satisfies v_2_1_0.SecurityScheme[]

  // Servers
  const servers = Object.values(oldData.servers ?? {}).map(
    (s) =>
      ({
        ...s,
        variables: s.variables ?? {},
      }) satisfies v_2_1_0.Server,
  )

  // Tags
  const tags = Object.values(oldData.folders ?? {}).map(
    (f) =>
      ({
        type: 'tag',
        uid: f.uid,
        name: f.name || 'unknownTag',
        description: f.description,
        children: f.childUids,
      }) satisfies v_2_1_0.Tag,
  )

  // Workspaces
  const workspaces = Object.values(oldData.workspaces ?? {}).map(
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
    requestExamples,
    requests,
    securitySchemes,
    servers,
    tags,
    workspaces,
  }
}
