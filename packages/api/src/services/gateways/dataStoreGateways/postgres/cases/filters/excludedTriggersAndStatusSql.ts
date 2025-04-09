import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"
import type { Row } from "postgres"

import type { Filters } from "../../../../../../types/CaseIndexQuerystring"

import {
  resolutionStatusCodeByText,
  ResolutionStatusNumber
} from "../../../../../../useCases/dto/convertResolutionStatus"

export const excludedTriggersAndStatusSql = (
  sql: postgres.Sql,
  filters: Filters,
  user: User
): postgres.PendingQuery<Row[]> => {
  const resolutionStatus = filters.caseState
    ? (resolutionStatusCodeByText(filters.caseState) ?? ResolutionStatusNumber.Unresolved)
    : ResolutionStatusNumber.Unresolved

  const excludedTriggers = user.excluded_triggers?.split(",") ?? []

  return sql`
    AND elt.status = ${resolutionStatus}
    AND NOT elt.trigger_code = ANY (${excludedTriggers})
  `
}
