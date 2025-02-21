import type { DisplayFullCourtCase } from "types/display/CourtCases"

export const exceptionsAreLockedByCurrentUser = (username: string, caseDto: DisplayFullCourtCase) => {
  return !!caseDto.errorLockedByUsername && caseDto.errorLockedByUsername === username
}
