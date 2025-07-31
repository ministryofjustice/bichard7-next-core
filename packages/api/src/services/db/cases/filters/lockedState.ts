import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"
import type { Row } from "postgres"

import { LockedState } from "@moj-bichard7/common/types/ApiCaseQuery"

import type { DatabaseConnection } from "../../../../types/DatabaseGateway"

export const filterByLockedState = (
  database: DatabaseConnection,
  user: User,
  lockedState?: LockedState
): postgres.PendingQuery<Row[]> => {
  if (!lockedState) {
    return database.connection``
  }

  if (lockedState === LockedState.Locked) {
    return database.connection`AND (el.error_locked_by_id IS NOT NULL OR el.trigger_locked_by_id IS NOT NULL)`
  }

  if (lockedState === LockedState.Unlocked) {
    return database.connection`AND (el.error_locked_by_id IS NULL AND el.trigger_locked_by_id IS NULL)`
  }

  if (lockedState === LockedState.LockedToMe && user.username) {
    return database.connection`AND (el.error_locked_by_id = ${user.username} OR el.trigger_locked_by_id = ${user.username})`
  }

  return database.connection``
}
