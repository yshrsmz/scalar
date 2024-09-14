import { semverLessThan } from '@/migrations/semver'
import { nineCarsDecide } from '@/migrations/v-2.1.0'

/** Handles all data migrations per entity */
export const migrator = (
  localStorageKey: string,
  { dataVersion, appVersion }: { dataVersion: string; appVersion: string },
) => {
  let data = localStorage.getItem(localStorageKey)

  // 0.0.0 -> 2.1.0 migration
  if (semverLessThan(dataVersion, '2.1.0'))
    data = nineCarsDecide[localStorageKey as keyof typeof nineCarsDecide]()

  return data
}
