import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"
import type { Row } from "postgres"

import { LockedState } from "@moj-bichard7/common/types/ApiCaseQuerystring"

export const filterByLockedState = (
  sql: postgres.Sql,
  user: User,
  lockedState?: LockedState
): postgres.PendingQuery<Row[]> => {
  if (!lockedState) {
    return sql``
  }

  if (lockedState === LockedState.Locked) {
    return sql`AND (el.error_locked_by_id IS NOT NULL OR el.trigger_locked_by_id IS NOT NULL)`
  }

  if (lockedState === LockedState.Unlocked) {
    return sql`AND (el.error_locked_by_id IS NULL OR el.trigger_locked_by_id IS NULL)`
  }

  if (lockedState === LockedState.LockedToMe && user.username) {
    return sql`AND (el.error_locked_by_id = ${user.username} OR el.trigger_locked_by_id = ${user.username})`
  }

  return sql``
}
