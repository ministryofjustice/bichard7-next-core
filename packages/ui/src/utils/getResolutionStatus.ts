import type { ResolutionStatus } from "../types/ResolutionStatus"
import type { DisplayFullCourtCase, DisplayPartialCourtCase } from "../types/display/CourtCases"

const getResolutionStatus = (courtCase: DisplayFullCourtCase | DisplayPartialCourtCase): ResolutionStatus =>
  courtCase.errorStatus === "Submitted" ? "Submitted" : courtCase.resolutionTimestamp ? "Resolved" : "Unresolved"

export default getResolutionStatus
