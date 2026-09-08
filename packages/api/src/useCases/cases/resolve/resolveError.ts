import type { ResolveBody } from "@moj-bichard7/common/contracts/ResolveBody"
import type { User } from "@moj-bichard7/common/types/User"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import { validateManualResolution } from "@moj-bichard7/common/utils/validateManualResolution"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import checkAllTriggersResolved from "../../../services/db/cases/checkAllTriggersResolved"
import checkCasePermission from "../../../services/db/cases/checkCasePermission"

export const resolveError = async (
  databaseConnection: WritableDatabaseConnection,
  user: User,
  caseId: number,
  resolution: ResolveBody
  /*   logger: FastifyBaseLogger */
): PromiseResult<void> => {
  const resolutionError = validateManualResolution(resolution).error

  if (resolutionError) {
    return new Error(resolutionError)
  }

  if (resolution.courtCaseErrorStatus === "Resolved") {
    return
  }

  const caseResult = await checkCasePermission(databaseConnection, user, caseId)

  if (isError(caseResult)) {
    return caseResult
  }

  const resolver = user.username
  const resolutionTimestamp = new Date()

  const updateFields: Record<string, unknown> = {
    error_resolved_by: resolver,
    error_resolved_ts: resolutionTimestamp,
    error_status: 2
  }

  const allTriggersResolved = await checkAllTriggersResolved(databaseConnection, caseId)

  if (allTriggersResolved) {
    updateFields.resolution_ts = resolutionTimestamp
  }

  const resolveErrorResult = await databaseConnection
    .transaction<Error | void>(async (tx) => {
      const updateResult = await tx.connection`
    UPDATE br7own.error_list
    SET ${tx.connection(updateFields)}
    WHERE error_id = ${caseId} AND error_locked_by_id = ${resolver} AND error_count > 0 AND error_status = 1
  `.catch((error: Error) => error)

      if (isError(updateResult)) {
        return new Error(`Couldn't resolve case id:${caseId}: ${updateResult.message}`)
      }
    })
    .catch((err) => err)

  if (isError(resolveErrorResult)) {
    return resolveErrorResult
  }
}
