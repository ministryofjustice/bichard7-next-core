import type postgres from "postgres"
import type { Row } from "postgres"

import type { DatabaseConnection } from "../../../../types/DatabaseGateway"

export const filterByResolvedByUsername = (
  database: DatabaseConnection,
  resolvedByUsername?: string
): postgres.PendingQuery<Row[]> => {
  if (!resolvedByUsername) {
    return database.connection``
  }

  const parts = resolvedByUsername.replace(/\*|\s+/g, "%")

  return database.connection`
    AND (
      el.error_resolved_by ILIKE ${"%" + parts + "%"}
      OR el.trigger_resolved_by ILIKE ${"%" + parts + "%"}
    )
  `
}
