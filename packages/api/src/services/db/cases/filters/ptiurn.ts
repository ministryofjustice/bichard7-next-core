import type postgres from "postgres"
import type { Row } from "postgres"

import { isEmpty } from "lodash"

import type { DatabaseConnection } from "../../../../types/DatabaseGateway"

export const filterByPtiurn = (database: DatabaseConnection, ptiurn?: string): postgres.PendingQuery<Row[]> => {
  if (isEmpty(ptiurn?.replace(/\s/g, ""))) {
    return database.connection``
  }

  return database.connection`AND el.ptiurn ILIKE ${"%" + ptiurn + "%"}`
}
