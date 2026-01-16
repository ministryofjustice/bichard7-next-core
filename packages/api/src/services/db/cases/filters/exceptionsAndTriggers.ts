import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"
import type { Row } from "postgres"

import Permission from "@moj-bichard7/common/types/Permission"
import { ResolutionStatus, ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { Filters } from "../../../../types/CaseIndexQuerystring"
import type { DatabaseConnection } from "../../../../types/DatabaseGateway"

export const exceptionsAndTriggers = (
  database: DatabaseConnection,
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
    exceptionsSql = database.connection`(el.error_count > 0 AND el.error_status = ANY (${resolutionStatus}))`
  }

  if (userAccess(user)[Permission.Triggers]) {
    triggersSql = database.connection`
        (
          SELECT COUNT(*)
          FROM br7own.error_list_triggers T1
          WHERE
            T1.error_id = el.error_id
            AND T1.status = ANY (${resolutionStatus})
            AND NOT (T1.trigger_code = ANY (${user.excludedTriggers}))
        ) > 0
      `
  }

  if (exceptionsSql && triggersSql) {
    return database.connection`AND (${exceptionsSql} OR ${triggersSql}) `
  } else if (exceptionsSql) {
    return database.connection`AND ${exceptionsSql}`
  } else if (triggersSql) {
    return database.connection`AND ${triggersSql}`
  }

  return database.connection``
}
