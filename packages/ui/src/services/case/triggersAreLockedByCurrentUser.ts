import type { DisplayFullCourtCase } from "types/display/CourtCases"

export const triggersAreLockedByCurrentUser = (username: string, caseDto: DisplayFullCourtCase) => {
  return !!caseDto.triggerLockedByUsername && caseDto.triggerLockedByUsername === username
}
