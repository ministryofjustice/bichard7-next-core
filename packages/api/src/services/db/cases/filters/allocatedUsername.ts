import type postgres from "postgres"
import type { Row } from "postgres"

import type { DatabaseConnection } from "../../../../types/DatabaseGateway"

export const filterByAllocatedUsername = (
  database: DatabaseConnection,
  allocatedUsername?: string
): postgres.PendingQuery<Row[]> => {
  if (!allocatedUsername) {
    return database.connection``
  }

  return database.connection`AND (el.error_locked_by_id = ${allocatedUsername} OR el.trigger_locked_by_id = ${allocatedUsername})`
}
