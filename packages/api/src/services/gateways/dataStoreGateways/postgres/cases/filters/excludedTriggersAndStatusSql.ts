import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"

import type { Filters } from "../../../../../../types/CaseIndexQuerystring"

import { resolutionStatusCodeByText } from "../../../../../../useCases/dto/convertResolutionStatus"

export const excludedTriggersAndStatusSql = (sql: postgres.Sql, filters: Filters, user: User) => {
  const resolutionStatus = filters.caseState ? (resolutionStatusCodeByText(filters.caseState) ?? 1) : 1
  const excludedTriggers = user.excluded_triggers?.split(",") ?? [""]

  return sql`
    AND elt.status = ${resolutionStatus}
    AND elt.trigger_code != ANY (${excludedTriggers})
  `
}
