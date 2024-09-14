import type {
  Collection,
  Cookie,
  Environment,
  Folder,
  Request,
  RequestExample,
  Server,
  Workspace,
} from '../v-0.0.0/types.generated'

// const data =
//   // Check for the new data structure to support the old ones
//   lsItem?.[0] === '['
//     ? parse(localStorage.getItem(localStorageKey) || '[{}]')
//     : JSON.parse(localStorage.getItem(localStorageKey) || '{}')
//
// const instances = Object.values(data) as T[]

/** V-0.0.0 to V-2.1.0 migration */
export const nineCarsDecide = {
  collection: () => {
    return []
  },
  cookie: () => {},
  environment: () => {},
  request: () => {},
  requestExample: () => {},
  securityScheme: () => {},
  server: () => {},
  tag: () => {},
  workspace: () => {},
}
