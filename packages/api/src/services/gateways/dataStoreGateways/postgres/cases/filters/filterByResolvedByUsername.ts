import type postgres from "postgres"
import type { Row } from "postgres"

import type { Filters } from "../../../../../../types/CaseIndexQuerystring"

export const filterByResolvedByUsername = (sql: postgres.Sql, filters: Filters): postgres.PendingQuery<Row[]> => {
  if (!filters.resolvedByUsername) {
    return sql``
  }

  const parts = filters.resolvedByUsername.replace(/\*|\s+/g, "%")

  return sql`
    AND (
      el.error_resolved_by ILIKE ${"%" + parts + "%"}
      OR el.trigger_resolved_by ILIKE ${"%" + parts + "%"}
    )
  `
}
