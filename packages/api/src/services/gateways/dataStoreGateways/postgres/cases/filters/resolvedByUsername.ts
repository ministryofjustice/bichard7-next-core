import type postgres from "postgres"

import type { Filters } from "../../../../../../types/CaseIndexQuerystring"

export const filterByResolvedByUsername = (sql: postgres.Sql, filters: Filters) => {
  if (!filters.resolvedByUsername) {
    return sql``
  }

  return sql`
    AND (
      el.error_resolved_by ILIKE ${filters.resolvedByUsername}
      OR el.trigger_resolved_by ILIKE ${filters.resolvedByUsername}
    )
  `
}
