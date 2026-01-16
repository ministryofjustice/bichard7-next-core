import { ResolutionStatus } from "@moj-bichard7/common/types/ResolutionStatus"

import type { DisplayFullCourtCase, DisplayPartialCourtCase } from "../types/display/CourtCases"

const getResolutionStatus = (courtCase: DisplayFullCourtCase | DisplayPartialCourtCase): ResolutionStatus =>
  courtCase.errorStatus === "Submitted"
    ? ResolutionStatus.Submitted
    : courtCase.resolutionTimestamp
      ? ResolutionStatus.Resolved
      : ResolutionStatus.Unresolved

export default getResolutionStatus
