import Permission from "@moj-bichard7/common/types/Permission"
import type { User } from "@moj-bichard7/common/types/User"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import formatForceNumbers from "../services/formatForceNumbers"
import type DataStoreGateway from "../services/gateways/interfaces/dataStoreGateway"

type ResubmitProps = {
  dataSourceGateway: DataStoreGateway
  user: User
  caseId: number
}

const canUserResubmitCase = async ({ dataSourceGateway, user, caseId }: ResubmitProps): Promise<boolean> => {
  const normalizedUser = { ...user, groups: user.groups ?? [] }
  if (!userAccess(normalizedUser)[Permission.CanResubmit]) {
    return false
  }

  const forceNumbers = formatForceNumbers(user.visible_forces)

  return await dataSourceGateway.canCaseBeResubmitted(user.username, caseId, forceNumbers)
}

export default canUserResubmitCase
