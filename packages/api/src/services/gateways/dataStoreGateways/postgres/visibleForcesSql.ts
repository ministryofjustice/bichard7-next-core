import type postgres from "postgres"
import type { Row } from "postgres"

export const visibleForcesSql = (sql: postgres.Sql, forceIds: number[]): postgres.PendingQuery<Row[]> => {
  if (forceIds.length === 0) {
    return sql`FALSE`
  }

  return sql`br7own.force_code (org_for_police_filter) = ANY (${forceIds})`
}
