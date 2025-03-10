import type postgres from "postgres"
import type { Row } from "postgres"

const visibleCourtsSql = (sql: postgres.Sql, visibleCourts: string[]): postgres.PendingQuery<Row[]> => {
  if (visibleCourts.length === 0) {
    return sql`FALSE`
  }

  const regex = `(${visibleCourts.map((vc) => vc + "*").join("|")})`
  return sql`el.court_code ~* ${regex}`
}

export default visibleCourtsSql
