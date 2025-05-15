import type postgres from "postgres"
import type { Row } from "postgres"

import type { DatabaseConnection } from "../../types/DatabaseGateway"

export const visibleForcesSql = (database: DatabaseConnection, forceIds: number[]): postgres.PendingQuery<Row[]> => {
  if (forceIds.length === 0) {
    return database.connection`FALSE`
  }

  return database.connection`br7own.force_code (org_for_police_filter) = ANY (${forceIds})`
}
