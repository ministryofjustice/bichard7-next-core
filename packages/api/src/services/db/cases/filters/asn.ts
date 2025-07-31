import type postgres from "postgres"
import type { Row } from "postgres"

import type { DatabaseConnection } from "../../../../types/DatabaseGateway"

export const filterByAsn = (database: DatabaseConnection, asn?: string): postgres.PendingQuery<Row[]> => {
  if (asn === undefined) {
    return database.connection``
  }

  const asnWithoutSlashes = asn.replace(/\//g, "")

  return database.connection`AND el.asn ILIKE ${"%" + asnWithoutSlashes + "%"}`
}
