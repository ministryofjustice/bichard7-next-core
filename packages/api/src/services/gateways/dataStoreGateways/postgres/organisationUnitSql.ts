import type postgres from "postgres"
import type { Row } from "postgres"

import { visibleCourtsSql } from "./visibleCourtsSql"
import { visibleForcesSql } from "./visibleForcesSql"

export const organisationUnitSql = (
  sql: postgres.Sql,
  visibleCourts: string[],
  forceIds: number[]
): postgres.PendingQuery<Row[]> => {
  return sql`${visibleCourtsSql(sql, visibleCourts)} OR ${visibleForcesSql(sql, forceIds)}`
}
