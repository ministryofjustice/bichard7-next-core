import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"
import type { Row } from "postgres"

import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"

import type { Filters } from "../../../../types/CaseIndexQuerystring"
import type { DatabaseConnection } from "../../../../types/DatabaseGateway"

import { resolutionStatusCodeByText } from "../../../../useCases/dto/convertResolutionStatus"

export const excludedTriggersAndStatusSql = (
  database: DatabaseConnection,
  user: User,
  filters: Filters
): postgres.PendingQuery<Row[]> => {
  const resolutionStatus = filters.caseState
    ? (resolutionStatusCodeByText(filters.caseState) ?? ResolutionStatusNumber.Unresolved)
    : ResolutionStatusNumber.Unresolved

  return database.connection`
    AND elt.status = ${resolutionStatus}
    AND NOT elt.trigger_code = ANY (${user.excludedTriggers})
  `
}
