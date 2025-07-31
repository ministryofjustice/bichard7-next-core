import type postgres from "postgres"
import type { Row } from "postgres"

import type { DatabaseConnection } from "../../../../types/DatabaseGateway"

export const filterByCourtName = (database: DatabaseConnection, courtName?: string): postgres.PendingQuery<Row[]> => {
  if (courtName === undefined) {
    return database.connection``
  }

  return database.connection`AND el.court_name ILIKE ${"%" + courtName + "%"}`
}
