import type postgres from "postgres"
import type { Row } from "postgres"

export const filterByCourtName = (sql: postgres.Sql, courtName?: string): postgres.PendingQuery<Row[]> => {
  if (courtName === undefined) {
    return sql``
  }

  return sql`AND el.court_name ILIKE ${"%" + courtName + "%"}`
}
