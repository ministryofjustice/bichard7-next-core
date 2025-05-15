import type postgres from "postgres"
import type { Row } from "postgres"

import type { Filters } from "../../../../types/CaseIndexQuerystring"
import type { DatabaseConnection } from "../../../../types/DatabaseGateway"

export const filterByCourtDate = (database: DatabaseConnection, filters: Filters): postgres.PendingQuery<Row[]> => {
  if (!filters.from || !filters.to) {
    return database.connection``
  }

  return database.connection`AND (el.court_date >= ${filters.from} AND el.court_date <= ${filters.to})`
}
