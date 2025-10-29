import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"
import { isError } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import selectMessageId from "../../../services/db/cases/selectMessageId"
import canUserResubmitCase from "./canUserResubmitCase"

type ResubmitCaseResult = {
  messageId: string
  workflowId: string
}

export const resubmitCase = async (
  databaseConnection: WritableDatabaseConnection,
  user: User,
  caseId: number,
  autoResubmit: boolean = false
): PromiseResult<ResubmitCaseResult> => {
  return databaseConnection
    .transaction(async (transaction) => {
      const canUserResubmitCaseResult = await canUserResubmitCase(transaction, user, caseId)

      if (isError(canUserResubmitCaseResult)) {
        throw canUserResubmitCaseResult
      }

      if (!canUserResubmitCaseResult) {
        throw new Error("User can't resubmit")
      }

      const messageId = await selectMessageId(transaction, user, caseId)

      if (isError(messageId)) {
        throw messageId
      }

      const conductorClient = createConductorClient()
      const resubmitWorkflowName = "resubmit"
      const workflowParams = { autoResubmit, messageId }

      const conductorResult = await conductorClient.workflowResource
        .startWorkflow1(resubmitWorkflowName, workflowParams, undefined, messageId)
        .catch((error: Error) => error)

      if (isError(conductorResult)) {
        throw conductorResult
      }

      return {
        messageId,
        workflowId: conductorResult
      } satisfies ResubmitCaseResult
    })
    .catch((error: Error) => error)
}
