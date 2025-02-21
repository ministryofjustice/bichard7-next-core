import type { DisplayFullCourtCase } from "types/display/CourtCases"

export const triggersAreLockedByAnotherUser = (username: string, caseDto: DisplayFullCourtCase) => {
  return !!caseDto.triggerLockedByUsername && caseDto.triggerLockedByUsername !== username
}
