import findPncCourtCase from "../../phase2/lib/findPncCourtCase"
import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"

const ADJOURNED_SINE_DIE_DISPOSAL_CODE = 2007

const getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie = (
  aho: AnnotatedHearingOutcome,
  offence: Offence
) => {
  if (
    !offence.CriminalProsecutionReference.OffenceReasonSequence ||
    !aho.PncQuery ||
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber
  ) {
    return undefined
  }

  const courtCase = findPncCourtCase(aho, offence)
  const matchingOffence = courtCase?.offences.find(
    (pncOffence) =>
      pncOffence.offence.sequenceNumber === Number(offence.CriminalProsecutionReference.OffenceReasonSequence)
  )

  const areAllDisposals2007 =
    matchingOffence?.disposals &&
    matchingOffence.disposals.length > 0 &&
    matchingOffence.disposals.every((disposal) => disposal.type === ADJOURNED_SINE_DIE_DISPOSAL_CODE)

  return areAllDisposals2007 ? matchingOffence.adjudication?.sentenceDate : undefined
}

export default getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie
