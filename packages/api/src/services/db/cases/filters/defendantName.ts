import type postgres from "postgres"
import type { Row } from "postgres"

import type { DatabaseConnection } from "../../../../types/DatabaseGateway"

export const filterByDefendantName = (
  database: DatabaseConnection,
  defendantName?: string
): postgres.PendingQuery<Row[]> => {
  if (defendantName === undefined) {
    return database.connection``
  }

  const parts = defendantName.replace(/\*|\s+/g, "%")

  return database.connection`AND el.defendant_name ILIKE ${parts + "%"}`
}
