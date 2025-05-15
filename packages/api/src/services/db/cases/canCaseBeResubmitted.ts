import type { User } from "@moj-bichard7/common/types/User"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import { NotFoundError } from "../../../types/errors/NotFoundError"

export interface CanCaseBeResubmittedResult {
  caseInForce: boolean
  caseIsSubmitted: boolean
  caseIsUnresolved: boolean
  lockedByUser: boolean
}

export default async (database: DatabaseConnection, user: User, caseId: number): PromiseResult<boolean> => {
  const result = await database.connection<CanCaseBeResubmittedResult[]>`
      SELECT
        (el.error_locked_by_id = ${user.username})::INTEGER as lockedByUser,
        (br7own.force_code(el.org_for_police_filter) = ANY((${user.visibleForces}::SMALLINT[])))::INTEGER as caseInForce,
        (el.resolution_ts IS NULL)::INTEGER as caseIsUnresolved,
        (el.error_status = 3)::INTEGER as caseIsSubmitted
      FROM br7own.error_list el
      WHERE
        el.error_id = ${caseId}
    `.catch((error: Error) => error)

  if (isError(result)) {
    return Error(
      `Error while checking if case can be resubmitted for case id ${caseId} and user ${user.username}: ${result.message}`
    )
  }

  if (!result || result.length === 0) {
    return new NotFoundError("Case not found")
  }

  const caseData = result[0]
  return caseData.lockedByUser && caseData.caseInForce && caseData.caseIsUnresolved && !caseData.caseIsSubmitted
}
