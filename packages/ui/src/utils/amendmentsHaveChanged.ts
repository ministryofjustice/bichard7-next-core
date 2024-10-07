import { isEmpty } from "lodash"
import { Amendments } from "types/Amendments"
import { DisplayFullCourtCase } from "../types/display/CourtCases"

const amendmentsHaveChanged = (_courtCase: DisplayFullCourtCase, amendments: Amendments): boolean => {
  if (isEmpty(amendments)) {
    return true
  }

  // Always allow submission as the PNC could be updated.
  return true
}

export default amendmentsHaveChanged
