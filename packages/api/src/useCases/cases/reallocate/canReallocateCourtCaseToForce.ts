import type { CaseDto } from "@moj-bichard7/common/types/Case"
import type { User } from "@moj-bichard7/common/types/User"

const exceptionsAreLockedByAnotherUser = (courtCase: CaseDto, username: string) => {
  return !!courtCase.errorLockedByUsername && courtCase.errorLockedByUsername !== username
}

const triggersAreLockedByAnotherUser = (courtCase: CaseDto, username: string) => {
  return !!courtCase.triggerLockedByUsername && courtCase.triggerLockedByUsername !== username
}

const canReallocateCourtCaseToForce = (courtCase: CaseDto, user: User): boolean => {
  const canReallocateAsExceptionHandler =
    !exceptionsAreLockedByAnotherUser(courtCase, user.username) && courtCase.errorStatus === "Unresolved"

  const canReallocateAsTriggerHandler =
    !triggersAreLockedByAnotherUser(courtCase, user.username) &&
    courtCase.triggerStatus === "Unresolved" &&
    courtCase.errorStatus !== "Unresolved" &&
    courtCase.errorStatus !== "Submitted"

  return canReallocateAsExceptionHandler || canReallocateAsTriggerHandler
}

export default canReallocateCourtCaseToForce
