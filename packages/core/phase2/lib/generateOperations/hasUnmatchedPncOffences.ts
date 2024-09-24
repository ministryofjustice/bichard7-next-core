import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"

const hasUnmatchedPncOffences = (aho: AnnotatedHearingOutcome, courtCaseReferenceNumber?: string): boolean => {
  const pncCourtCaseRef =
    courtCaseReferenceNumber || aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber

  const pncCourtCase = aho.PncQuery?.courtCases?.find((courtCase) => courtCase.courtCaseReference === pncCourtCaseRef)
  const hoOffences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  const hasMatchedPncOffences = !!pncCourtCase?.offences.some((pncOffence) =>
    hoOffences.some(
      (hoOffence) =>
        Number(hoOffence.CriminalProsecutionReference.OffenceReasonSequence ?? undefined) ===
          pncOffence.offence.sequenceNumber && hoOffence.CourtCaseReferenceNumber === courtCaseReferenceNumber
    )
  )

  return !hasMatchedPncOffences
}

export default hasUnmatchedPncOffences
