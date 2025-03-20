import type postgres from "postgres"
import type { Row } from "postgres"

export const filterByResolvedByUsername = (
  sql: postgres.Sql,
  resolvedByUsername?: string
): postgres.PendingQuery<Row[]> => {
  if (!resolvedByUsername) {
    return sql``
  }

  const parts = resolvedByUsername.replace(/\*|\s+/g, "%")

  return sql`
    AND (
      el.error_resolved_by ILIKE ${"%" + parts + "%"}
      OR el.trigger_resolved_by ILIKE ${"%" + parts + "%"}
    )
  `
}
