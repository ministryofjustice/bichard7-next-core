import type { DisplayFullCourtCase, DisplayPartialCourtCase } from "../types/display/CourtCases"
import type { ResolutionStatus } from "../types/ResolutionStatus"

const getResolutionStatus = (courtCase: DisplayFullCourtCase | DisplayPartialCourtCase): ResolutionStatus =>
  courtCase.errorStatus === "Submitted" ? "Submitted" : courtCase.resolutionTimestamp ? "Resolved" : "Unresolved"

export default getResolutionStatus
