import type postgres from "postgres"
import type { Row } from "postgres"

import type { Filters } from "../../../../../../types/CaseIndexQuerystring"

import { filterByCourtName } from "./courtName"
import { filterByDefendantName } from "./defendantName"

export const generateFilters = (
  sql: postgres.Sql,
  resolutionStatus: number,
  filters: Filters
): postgres.PendingQuery<Row[]> => {
  return sql`
    -- This makes it fast
    AND (el.error_status = ${resolutionStatus} OR el.trigger_status = ${resolutionStatus})
    AND (el.trigger_status = ${resolutionStatus} OR el.error_status = ${resolutionStatus})
    -- End of fast
    AND el.resolution_ts IS NULL
    ${filterByDefendantName(sql, filters.defendantName)}
    ${filterByCourtName(sql, filters.courtName)}
  `
}
