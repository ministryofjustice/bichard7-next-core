import type { User } from "@moj-bichard7/common/types/User"

import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type DataStoreGateway from "../services/gateways/interfaces/dataStoreGateway"

type ResubmitProps = {
  caseId: number
  dataStore: DataStoreGateway
  user: User
}

const canUserResubmitCase = async ({ caseId, dataStore, user }: ResubmitProps): Promise<boolean> => {
  const normalizedUser = { ...user, groups: user.groups ?? [] }
  if (!userAccess(normalizedUser)[Permission.CanResubmit]) {
    return false
  }

  return await dataStore.canCaseBeResubmitted(user.username, caseId)
}

export default canUserResubmitCase
