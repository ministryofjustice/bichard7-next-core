import type postgres from "postgres"
import type { Row } from "postgres"

export const filterByAllocatedUsername = (
  sql: postgres.Sql,
  allocatedUsername?: string
): postgres.PendingQuery<Row[]> => {
  if (!allocatedUsername) {
    return sql``
  }

  return sql`AND (el.error_locked_by_id = ${allocatedUsername} OR el.trigger_locked_by_id = ${allocatedUsername})`
}
