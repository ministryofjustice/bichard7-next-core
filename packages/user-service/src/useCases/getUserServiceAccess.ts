import { AuthenticationTokenPayload } from "lib/token/authenticationToken"
import UserGroup from "types/UserGroup"

export interface UserServiceAccess {
  hasAccessToBichard: boolean
  hasAccessToUserManagement: boolean
  hasAccessToReports: boolean
  hasAccessToNewBichard: boolean
}

const bichardGroups = [
  "B7Allocator",
  "B7Audit",
  "B7ExceptionHandler",
  "B7GeneralHandler",
  "B7Supervisor",
  "B7TriggerHandler"
]

export default ({ groups }: AuthenticationTokenPayload): UserServiceAccess => {
  const hasAccessToBichard = bichardGroups.some((g) => groups.includes(g as UserGroup))

  const hasAccessToUserManagement = groups.includes("B7UserManager" as UserGroup)

  const hasAccessToNewBichard = groups.includes("B7NewUI" as UserGroup)

  const hasAccessToReports = bichardGroups.some((g) => groups.includes(g as UserGroup))

  return {
    hasAccessToBichard,
    hasAccessToUserManagement,
    hasAccessToReports,
    hasAccessToNewBichard
  }
}
