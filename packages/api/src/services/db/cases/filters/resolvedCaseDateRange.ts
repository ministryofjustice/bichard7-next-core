import type postgres from "postgres"
import type { Row } from "postgres"

import type { Filters } from "../../../../types/CaseIndexQuerystring"
import type { DatabaseConnection } from "../../../../types/DatabaseGateway"

import { ResolutionStatus } from "../../../../useCases/dto/convertResolutionStatus"

export const filterByResolvedCaseDateRange = (
  database: DatabaseConnection,
  filters: Filters
): postgres.PendingQuery<Row[]> => {
  if (!filters.caseState || filters.caseState !== ResolutionStatus.Resolved) {
    return database.connection``
  }

  if (!filters.resolvedFrom || !filters.resolvedTo) {
    return database.connection``
  }

  return database.connection`AND el.resolution_ts >= ${filters.resolvedFrom} AND el.resolution_ts <= ${filters.resolvedTo}`
}
