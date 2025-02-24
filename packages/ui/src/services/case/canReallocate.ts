import type { DisplayFullCourtCase } from "types/display/CourtCases"
import { exceptionsAreLockedByAnotherUser } from "./exceptionsAreLockedByAnotherUser"
import { triggersAreLockedByAnotherUser } from "./triggersAreLockedByAnotherUser"

export const canReallocate = (username: string, caseDto: DisplayFullCourtCase) => {
  const canReallocateAsExceptionHandler =
    !exceptionsAreLockedByAnotherUser(username, caseDto) && caseDto.errorStatus === "Unresolved"
  const canReallocateAsTriggerHandler =
    !triggersAreLockedByAnotherUser(username, caseDto) &&
    caseDto.triggerStatus === "Unresolved" &&
    caseDto.errorStatus !== "Unresolved" &&
    caseDto.errorStatus !== "Submitted"

  return canReallocateAsExceptionHandler || canReallocateAsTriggerHandler
}
