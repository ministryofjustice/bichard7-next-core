import type postgres from "postgres"
import type { Row } from "postgres"

import type { Filters } from "../../../../../../types/CaseIndexQuerystring"

export const filterByCourtDate = (sql: postgres.Sql, filters: Filters): postgres.PendingQuery<Row[]> => {
  if (!filters.from || !filters.to) {
    return sql``
  }

  return sql`AND (el.court_date >= ${filters.from} AND el.court_date <= ${filters.to})`
}
