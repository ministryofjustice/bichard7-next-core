import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"
import type { Row } from "postgres"

import { type Filters, LockedState } from "../../../../../../types/CaseIndexQuerystring"

export const filterByLockedState = (sql: postgres.Sql, user: User, filters: Filters): postgres.PendingQuery<Row[]> => {
  if (!filters.lockedState) {
    return sql``
  }

  if (filters.lockedState === LockedState.Locked) {
    return sql`AND (el.error_locked_by_id IS NOT NULL OR el.trigger_locked_by_id IS NOT NULL)`
  }

  if (filters.lockedState === LockedState.Unlocked) {
    return sql`AND (el.error_locked_by_id IS NULL OR el.trigger_locked_by_id IS NULL)`
  }

  if (filters.lockedState === LockedState.LockedToMe && user.username) {
    return sql`AND (el.error_locked_by_id = ${user.username} OR el.trigger_locked_by_id = ${user.username})`
  }

  return sql``
}
