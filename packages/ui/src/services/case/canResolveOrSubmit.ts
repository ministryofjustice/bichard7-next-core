import Permission from "@moj-bichard7/common/types/Permission"
import type User from "services/entities/User"
import type { DisplayFullCourtCase } from "types/display/CourtCases"
import { exceptionsAreLockedByCurrentUser } from "./exceptionsAreLockedByCurrentUser"

export const canResolveOrSubmit = (user: User, caseDto: DisplayFullCourtCase) => {
  const canResolveOrSubmit =
    exceptionsAreLockedByCurrentUser(user.username, caseDto) &&
    caseDto.errorStatus === "Unresolved" &&
    user.hasAccessTo[Permission.Exceptions]

  return canResolveOrSubmit
}
