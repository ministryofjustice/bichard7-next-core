import type postgres from "postgres"
import type { Row } from "postgres"

import visibleCourtsSql from "./visibleCourtsSql"

const organisationUnitSql = (
  sql: postgres.Sql,
  visibleCourts: string[],
  forceIds: number[]
): postgres.PendingQuery<Row[]> => {
  return sql`${visibleCourtsSql(sql, visibleCourts)} OR br7own.force_code(el.org_for_police_filter) = ANY(${forceIds}::SMALLINT[])`
}

export default organisationUnitSql
