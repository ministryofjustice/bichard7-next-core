import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import { fetchCasesForAutoResubmit } from "../../../services/db/cases/fetchCasesForAutoResubmit"
import { resubmitCase } from "./resubmitCase"

type BulkResubmit = Record<string, Error | ResubmitDetails>

type ResubmitDetails = {
  errorId: number
  workflowId?: string
}

const AUTO_RESUBMIT = true

export const resubmitCases = async (
  databaseConnection: WritableDatabaseConnection,
  user: User
): PromiseResult<BulkResubmit> => {
  if (!user.groups.includes(UserGroup.Service)) {
    return new Error("Missing System User")
  }

  const bulkResubmit: BulkResubmit = {}

  const cases = await fetchCasesForAutoResubmit(databaseConnection, user)

  if (isError(cases)) {
    throw cases
  }

  for (const caseRow of cases) {
    const resubmitResult = await resubmitCase(databaseConnection, user, caseRow.error_id, AUTO_RESUBMIT)

    if (isError(resubmitResult)) {
      bulkResubmit[caseRow.message_id] = resubmitResult
      continue
    }

    bulkResubmit[caseRow.message_id] = {
      errorId: caseRow.error_id,
      workflowId: resubmitResult.workflowId
    }
  }

  return bulkResubmit
}
