import type { DisplayFullCourtCase } from "types/display/CourtCases"

export const exceptionsAreLockedByAnotherUser = (username: string, caseDto: DisplayFullCourtCase) => {
  return !!caseDto.errorLockedByUsername && caseDto.errorLockedByUsername !== username
}
