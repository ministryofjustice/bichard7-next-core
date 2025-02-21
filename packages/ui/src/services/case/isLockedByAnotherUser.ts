import type { DisplayFullCourtCase } from "types/display/CourtCases"
import { exceptionsAreLockedByAnotherUser } from "./exceptionsAreLockedByAnotherUser"
import { triggersAreLockedByAnotherUser } from "./triggersAreLockedByAnotherUser"

export const isLockedByAnotherUser = (username: string, caseDto: DisplayFullCourtCase) =>
  exceptionsAreLockedByAnotherUser(username, caseDto) || triggersAreLockedByAnotherUser(username, caseDto)
