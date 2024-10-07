import type { User } from "@moj-bichard7/common/types/User"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import formatForceNumbers from "../src/services/formatForceNumbers"
import type Gateway from "../src/services/gateways/interfaces/gateway"

type ResumbitProps = {
  gateway: Gateway
  user: User
  caseId: number
}

const canUserResubmitCase = async ({ gateway, user, caseId }: ResumbitProps): Promise<boolean> => {
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

  return await gateway.filterUserHasSameForceAsCaseAndLockedByUser(user.username, caseId, forceNumbers)
}

export default canUserResubmitCase
