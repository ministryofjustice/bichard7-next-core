import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import { resubmitCase } from "./resubmitCase"

type BulkResubmitResult = Record<number, Error | ResubmitResult>

type ResubmitResult = {
  messageId: string
  success: boolean
}

export const resubmitCases = async (
  databaseConnection: WritableDatabaseConnection,
  user: User,
  caseIds: number[]
): PromiseResult<BulkResubmitResult> => {
  if (caseIds.length === 0) {
    return new Error("No Case IDs given")
  }

  if (!user.groups.includes(UserGroup.Service)) {
    return new Error("Missing System User")
  }

  const results: BulkResubmitResult = {}

  for (const caseId of caseIds) {
    const result = await resubmitCase(databaseConnection, user, caseId)

    if (isError(result)) {
      results[caseId] = result
      continue
    }

    results[caseId] = { messageId: result.messageId, success: true } satisfies ResubmitResult
  }

  return results
}
