import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"
import type { Row } from "postgres"

import { ResolutionStatus } from "@moj-bichard7/common/types/ApiCaseQuery"
import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { Filters } from "../../../../../../types/CaseIndexQuerystring"

import { ResolutionStatusNumber } from "../../../../../../useCases/dto/convertResolutionStatus"

export const exceptionsAndTriggers = (
  sql: postgres.Sql,
  user: User,
  filters: Filters
): postgres.PendingQuery<Row[]> => {
  const resolutionStatus: number[] =
    filters.caseState === ResolutionStatus.Resolved
      ? [ResolutionStatusNumber.Resolved]
      : [ResolutionStatusNumber.Unresolved, ResolutionStatusNumber.Submitted]
  let exceptionsSql
  let triggersSql

  if (userAccess(user)[Permission.Exceptions]) {
    exceptionsSql = sql`(el.error_count > 0 AND el.error_status = ANY (${resolutionStatus}))`
  }

  if (userAccess(user)[Permission.Triggers]) {
    const excludedTriggers = user.excluded_triggers?.split(",") ?? []

    triggersSql = sql`
        (
          SELECT COUNT(*)
          FROM br7own.error_list_triggers T1
          WHERE
            T1.error_id = el.error_id
            AND T1.status = ANY (${resolutionStatus})
            AND NOT (T1.trigger_code = ANY (${excludedTriggers}))
        ) > 0
      `
  }

  if (exceptionsSql && triggersSql) {
    return sql`AND (${exceptionsSql} OR ${triggersSql}) `
  } else if (exceptionsSql) {
    return sql`AND ${exceptionsSql}`
  } else if (triggersSql) {
    return sql`AND ${triggersSql}`
  }

  return sql``
}
