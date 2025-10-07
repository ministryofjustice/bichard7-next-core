import type { User } from "@moj-bichard7/common/types/User"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import { NotFoundError } from "../../../types/errors/NotFoundError"
import { visibleCourtsSql } from "../visibleCourtsSql"
import { visibleForcesSql } from "../visibleForcesSql"

export interface CanCaseBeResubmittedResult {
  caseInCourt: 0 | 1
  caseInForce: 0 | 1
  caseIsUnresolved: 0 | 1
  lockedByUser: 0 | 1
}

export default async (database: DatabaseConnection, user: User, caseId: number): PromiseResult<boolean> => {
  const result = await database.connection<CanCaseBeResubmittedResult[]>`
      SELECT
        (el.error_locked_by_id = ${user.username})::INTEGER as "lockedByUser",
        (${visibleForcesSql(database, user.visibleForces)})::INTEGER as "caseInForce",
        (${visibleCourtsSql(database, user.visibleCourts)})::INTEGER as "caseInCourt",
        (el.error_status = 1)::INTEGER as "caseIsUnresolved"
      FROM br7own.error_list el
      WHERE
        el.error_id = ${caseId}
    `.catch((error: Error) => error)

  if (isError(result)) {
    return result
  }

  if (!result || result.length === 0) {
    return new NotFoundError("Case not found")
  }

  const caseData = result[0]
  return !!caseData.lockedByUser && (!!caseData.caseInForce || !!caseData.caseInCourt) && !!caseData.caseIsUnresolved
}
