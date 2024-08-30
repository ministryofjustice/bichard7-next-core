import { sortBy } from "lodash"
import CourtCase from "services/entities/CourtCase"
import { DisplayFullCourtCase, DisplayPartialCourtCase } from "types/display/CourtCases"
import parseHearingOutcome from "utils/parseHearingOutcome"
import { hasAccessToExceptions } from "../../utils/userPermissions"
import User from "../entities/User"
import { noteToDisplayNoteDto } from "./noteDto"
import { triggerToDisplayTriggerDto } from "./triggerDto"

export const courtCaseToDisplayPartialCourtCaseDto = (
  courtCase: CourtCase,
  currentUser: User
): DisplayPartialCourtCase => {
  const displayPartialCourtCase: DisplayPartialCourtCase = {
    asn: courtCase.asn,
    courtDate: courtCase.courtDate ? courtCase.courtDate.toISOString() : undefined,
    courtName: courtCase.courtName,
    errorId: courtCase.errorId,
    errorLockedByUsername: courtCase.errorLockedByUsername,
    errorReport: courtCase.errorReport,
    errorStatus: courtCase.errorStatus ?? null,
    canUserEditExceptions:
      courtCase.errorLockedByUsername === currentUser?.username &&
      hasAccessToExceptions(currentUser) &&
      courtCase.errorStatus === "Unresolved",
    isUrgent: courtCase.isUrgent,
    notes: sortBy(courtCase.notes.map(noteToDisplayNoteDto), "createdAt"),
    ptiurn: courtCase.ptiurn,
    resolutionTimestamp: courtCase.resolutionTimestamp ? courtCase.resolutionTimestamp.toISOString() : null,
    triggerLockedByUsername: courtCase.triggerLockedByUsername,
    triggers: courtCase.triggers.map(triggerToDisplayTriggerDto),
    triggerStatus: courtCase.triggerStatus ?? null,
    triggerCount: courtCase.triggerCount,
    defendantName: courtCase.defendantName
  }

  if (courtCase.errorLockedByUserFullName) {
    displayPartialCourtCase.errorLockedByUserFullName = courtCase.errorLockedByUserFullName
  }

  if (courtCase.triggerLockedByUserFullName) {
    displayPartialCourtCase.triggerLockedByUserFullName = courtCase.triggerLockedByUserFullName
  }

  return displayPartialCourtCase
}

export const courtCaseToDisplayFullCourtCaseDto = (courtCase: CourtCase, user: User): DisplayFullCourtCase => {
  const annotatedHearingOutcome = parseHearingOutcome(courtCase.hearingOutcome)
  const updatedHearingOutcome = courtCase.updatedHearingOutcome && parseHearingOutcome(courtCase.updatedHearingOutcome)

  const courtCaseInfo: DisplayFullCourtCase = {
    ...courtCaseToDisplayPartialCourtCaseDto(courtCase, user),
    orgForPoliceFilter: courtCase.orgForPoliceFilter,
    courtCode: courtCase.courtCode,
    courtReference: courtCase.courtReference,
    phase: courtCase.phase,
    aho: JSON.parse(JSON.stringify(annotatedHearingOutcome)),
    updatedHearingOutcome: JSON.parse(JSON.stringify(updatedHearingOutcome))
  }

  return courtCaseInfo
}
