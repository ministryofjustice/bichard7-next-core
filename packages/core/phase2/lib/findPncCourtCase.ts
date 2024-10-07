import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"

const findPncCourtCase = (aho: AnnotatedHearingOutcome, offence: Offence) => {
  const courtCaseReference =
    offence.CourtCaseReferenceNumber ?? aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber

  return courtCaseReference
    ? aho.PncQuery?.courtCases?.find((x) => x.courtCaseReference === courtCaseReference)
    : undefined
}

export default findPncCourtCase
