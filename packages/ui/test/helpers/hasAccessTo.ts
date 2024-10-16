import { UserGroup } from "types/UserGroup"
import { userAccess } from "utils/userPermissions"

export const hasAccessToAll = userAccess({ groups: Object.values(UserGroup) })
export const hasAccessToNone = userAccess({ groups: [] })
export const triggerHandlerHasAccessTo = userAccess({ groups: [UserGroup.TriggerHandler] })
export const exceptionHandlerHasAccessTo = userAccess({ groups: [UserGroup.ExceptionHandler] })
export const triggerAndExceptionHandlerHasAccessTo = userAccess({
  groups: [UserGroup.TriggerHandler, UserGroup.ExceptionHandler]
})
export const generalHandlerHasAccessTo = userAccess({ groups: [UserGroup.GeneralHandler] })
export const supervisorHasAccessTo = userAccess({ groups: [UserGroup.Supervisor] })
