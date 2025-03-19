import type postgres from "postgres"
import type { Row } from "postgres"

import type { Filters } from "../../../../../../types/CaseIndexQuerystring"

import { ResolutionStatus } from "../../../../../../useCases/dto/convertResolutionStatus"

export const filterByResolvedCaseDateRange = (sql: postgres.Sql, filters: Filters): postgres.PendingQuery<Row[]> => {
  if (!filters.caseState || filters.caseState !== ResolutionStatus.Resolved) {
    return sql``
  }

  if (!filters.resolvedFrom || !filters.resolvedTo) {
    return sql``
  }

  return sql`AND el.resolution_ts >= ${filters.resolvedFrom} AND el.resolution_ts <= ${filters.resolvedTo}`
}
