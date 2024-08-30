import { ResolutionStatus } from "../types/ResolutionStatus"
import { DisplayFullCourtCase, DisplayPartialCourtCase } from "../types/display/CourtCases"

const getResolutionStatus = (courtCase: DisplayFullCourtCase | DisplayPartialCourtCase): ResolutionStatus =>
  courtCase.errorStatus === "Submitted" ? "Submitted" : courtCase.resolutionTimestamp ? "Resolved" : "Unresolved"

export default getResolutionStatus
