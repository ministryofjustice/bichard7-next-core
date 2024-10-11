import type { User } from "@moj-bichard7/common/types/User"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import formatForceNumbers from "../services/formatForceNumbers"
import type Gateway from "../services/gateways/interfaces/gateway"

type ResubmitProps = {
  gateway: Gateway
  user: User
  caseId: number
}

const canUserResubmitCase = async ({ gateway, user, caseId }: ResubmitProps): Promise<boolean> => {
  if (
    !user.groups.some(
      (group) =>
        group === UserGroup.ExceptionHandler ||
        group === UserGroup.GeneralHandler ||
        group === UserGroup.Allocator ||
        group === UserGroup.Supervisor
    )
  ) {
    return false
  }

  const forceNumbers = formatForceNumbers(user.visible_forces)

  return await gateway.caseCanBeResubmitted(user.username, caseId, forceNumbers)
}

export default canUserResubmitCase
