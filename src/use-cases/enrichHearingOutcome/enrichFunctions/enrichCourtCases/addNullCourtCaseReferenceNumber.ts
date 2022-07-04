import type { Offence } from "src/types/AnnotatedHearingOutcome"

const addNullCourtCaseReferenceNumber = (hoOffence: Offence): void => {
  if (hoOffence.CourtCaseReferenceNumber === undefined) {
    hoOffence.CourtCaseReferenceNumber = null
  }
}

export default addNullCourtCaseReferenceNumber
