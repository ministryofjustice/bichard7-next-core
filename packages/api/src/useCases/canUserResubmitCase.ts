import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { DatabaseConnection } from "../types/DatabaseGateway"

import canCaseBeResubmitted from "../services/db/cases/canCaseBeResubmitted"

const canUserResubmitCase = async (
  database: DatabaseConnection,
  user: User,
  caseId: number
): PromiseResult<boolean> => {
  const normalizedUser = { ...user, groups: user.groups ?? [] }
  if (!userAccess(normalizedUser)[Permission.CanResubmit]) {
    return false
  }

  return canCaseBeResubmitted(database, user, caseId)
}

export default canUserResubmitCase
