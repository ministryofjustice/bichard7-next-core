import type { AnnotatedHearingOutcome, Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

const findPncCourtCase = (aho: AnnotatedHearingOutcome, offence: Offence) => {
  const courtCaseReference =
    offence.CourtCaseReferenceNumber ?? aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber

  return courtCaseReference
    ? aho.PncQuery?.courtCases?.find((pncCourtCase) => pncCourtCase.courtCaseReference === courtCaseReference)
    : undefined
}

export default findPncCourtCase
