import type { DisplayFullCourtCase } from "types/display/CourtCases"
import { exceptionsAreLockedByCurrentUser } from "./exceptionsAreLockedByCurrentUser"
import { triggersAreLockedByCurrentUser } from "./triggersAreLockedByCurrentUser"

export const isLockedByCurrentUser = (username: string, caseDto: DisplayFullCourtCase) => {
  return triggersAreLockedByCurrentUser(username, caseDto) || exceptionsAreLockedByCurrentUser(username, caseDto)
}
