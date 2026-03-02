import Permission from "../types/Permission"
import { UserGroup } from "../types/UserGroup"

// This type is used instead of the User entity to avoid dependency cycles
type User = { groups: UserGroup[] }
const hasAccessToTriggers = (user: User): boolean =>
  user.groups?.some(
    (group) =>
      group === UserGroup.TriggerHandler ||
      group === UserGroup.GeneralHandler ||
      group === UserGroup.Allocator ||
      group === UserGroup.Supervisor
  )

const hasAccessToExceptions = (user: User): boolean =>
  user.groups?.some(
    (group) =>
      group === UserGroup.ExceptionHandler ||
      group === UserGroup.GeneralHandler ||
      group === UserGroup.Allocator ||
      group === UserGroup.Supervisor
  )

const isSupervisor = (user: User): boolean => user.groups?.some((group) => group === UserGroup.Supervisor)

const isUserManager = (user: User): boolean =>
  user.groups?.some((group) => group === UserGroup.UserManager || group === UserGroup.SuperUserManager)

const isServiceUser = (user: User): boolean => user.groups?.includes(UserGroup.Service)

const userAccess = (user: User): { [key in Permission]: boolean } => {
  return {
    [Permission.CanAuditCases]: isSupervisor(user),
    [Permission.CanListUsers]: isSupervisor(user),
    [Permission.CanResubmit]: hasAccessToExceptions(user) || isServiceUser(user),
    [Permission.CaseDetailsSidebar]: hasAccessToTriggers(user) || hasAccessToExceptions(user),
    [Permission.Exceptions]: hasAccessToExceptions(user),
    [Permission.ListAllCases]: isSupervisor(user),
    [Permission.Triggers]: hasAccessToTriggers(user),
    [Permission.UnlockOtherUsersCases]: isSupervisor(user),
    [Permission.ViewReports]: isSupervisor(user),
    [Permission.ViewUserManagement]: isUserManager(user)
  }
}

export { hasAccessToExceptions, hasAccessToTriggers, isServiceUser, isSupervisor, userAccess }
