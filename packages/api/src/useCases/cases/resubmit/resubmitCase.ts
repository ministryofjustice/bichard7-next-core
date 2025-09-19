import type { User } from "@moj-bichard7/common/types/User"

import { isError } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import updateErrorStatus from "../../../services/db/cases/updateErrorStatus"
import { ResolutionStatus } from "../../dto/convertResolutionStatus"
import canUserResubmitCase from "./canUserResubmitCase"

export const resubmitCase = async (databaseConnection: WritableDatabaseConnection, user: User, caseId: number) => {
  const canUserResubmitCaseResult = await canUserResubmitCase(databaseConnection, user, caseId)

  if (isError(canUserResubmitCaseResult)) {
    return canUserResubmitCaseResult
  }

  if (!canUserResubmitCaseResult) {
    return new Error("User can't resubmit")
  }

  const result = await updateErrorStatus(databaseConnection, caseId, ResolutionStatus.Submitted)

  if (isError(result)) {
    return result
  }

  // TODO: Create Conductor workflow with the case's message id

  return result
}
