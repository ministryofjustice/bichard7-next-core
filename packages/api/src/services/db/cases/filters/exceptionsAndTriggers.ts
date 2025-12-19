import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"
import type { Row } from "postgres"

import { ResolutionStatus } from "@moj-bichard7/common/types/ApiCaseQuery"
import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { Filters } from "../../../../types/CaseIndexQuerystring"
import type { DatabaseConnection } from "../../../../types/DatabaseGateway"

import { ResolutionStatusNumber } from "../../../../useCases/dto/convertResolutionStatus"

function getResolutionStatuses(filters?: Filters) {
  if (filters == null) {
    return [ResolutionStatusNumber.Resolved, ResolutionStatusNumber.Unresolved, ResolutionStatusNumber.Submitted]
  }

  return filters.caseState === ResolutionStatus.Resolved
    ? [ResolutionStatusNumber.Resolved]
    : [ResolutionStatusNumber.Unresolved, ResolutionStatusNumber.Submitted]
}

export const exceptionsAndTriggers = (
  database: DatabaseConnection,
  user: User,
  filters?: Filters
): postgres.PendingQuery<Row[]> => {
  const resolutionStatus = getResolutionStatuses(filters)
  let exceptionsSql
  let triggersSql

  if (userAccess(user)[Permission.Exceptions]) {
    exceptionsSql = database.connection`
      (
        el.error_count > 0
        AND el.error_status = ANY (${resolutionStatus})
      )`
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
