import type { User } from "@moj-bichard7/common/types/User"
import formatForceNumbers from "../services/formatForceNumbers"
import type Gateway from "../services/gateways/interfaces/gateway"
import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

type ResubmitProps = {
  gateway: Gateway
  user: User
  caseId: number
}

const canUserResubmitCase = async ({ gateway, user, caseId }: ResubmitProps): Promise<boolean> => {
  const normalizedUser = { ...user, groups: user.groups ?? [] }
  if (!userAccess(normalizedUser)[Permission.CanResubmit]) {
    return false
  }

  const forceNumbers = formatForceNumbers(user.visible_forces)

  return await gateway.canCaseBeResubmitted(user.username, caseId, forceNumbers)
}

export default canUserResubmitCase
