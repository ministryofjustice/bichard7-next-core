import type { User } from "@moj-bichard7/common/types/User"

import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type DataStoreGateway from "../services/gateways/interfaces/dataStoreGateway"

import formatForceNumbers from "../services/formatForceNumbers"

type ResubmitProps = {
  caseId: number
  db: DataStoreGateway
  user: User
}

const canUserResubmitCase = async ({ caseId, db, user }: ResubmitProps): Promise<boolean> => {
  const normalizedUser = { ...user, groups: user.groups ?? [] }
  if (!userAccess(normalizedUser)[Permission.CanResubmit]) {
    return false
  }

  const forceNumbers = formatForceNumbers(user.visible_forces)

  return await db.canCaseBeResubmitted(user.username, caseId, forceNumbers)
}

export default canUserResubmitCase
