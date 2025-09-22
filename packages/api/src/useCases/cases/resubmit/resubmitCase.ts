import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"
import { isError } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import updateErrorStatus from "../../../services/db/cases/updateErrorStatus"
import { ResolutionStatus } from "../../dto/convertResolutionStatus"
import canUserResubmitCase from "./canUserResubmitCase"

type ResubmitCaseResult = {
  messageId: string
  workflowId: string
}

export const resubmitCase = async (
  databaseConnection: WritableDatabaseConnection,
  user: User,
  caseId: number
): PromiseResult<ResubmitCaseResult> => {
  return databaseConnection
    .transaction(async (transaction) => {
      const canUserResubmitCaseResult = await canUserResubmitCase(transaction, user, caseId)

      if (isError(canUserResubmitCaseResult)) {
        return canUserResubmitCaseResult
      }

      if (!canUserResubmitCaseResult) {
        return new Error("User can't resubmit")
      }

      const result = await updateErrorStatus(transaction, caseId, ResolutionStatus.Submitted)

      if (isError(result)) {
        return result
      }

      const conductorClient = createConductorClient()
      const resubmitWorkflowName = "resubmit"

      const conductorResult = await conductorClient.workflowResource
        .startWorkflow1(resubmitWorkflowName, { messageId: result }, undefined, result)
        .catch((error: Error) => error)

      if (isError(conductorResult)) {
        return conductorResult
      }

      return {
        messageId: result,
        workflowId: conductorResult
      } satisfies ResubmitCaseResult
    })
    .catch((error: Error) => error)
}
