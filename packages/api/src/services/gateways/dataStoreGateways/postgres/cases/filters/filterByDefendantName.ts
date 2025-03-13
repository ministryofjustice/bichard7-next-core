import type postgres from "postgres"
import type { Row } from "postgres"

export const filterByDefendantName = (sql: postgres.Sql, defendantName?: string): postgres.PendingQuery<Row[]> => {
  if (defendantName === undefined) {
    return sql``
  }

  const parts = defendantName.replace(/\*|\s+/g, "%")

  return sql`AND el.defendant_name ILIKE ${"%" + parts + "%"}`
}
