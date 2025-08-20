import type { AnnotatedHearingOutcome, Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import findPncCourtCase from "../../../lib/pnc/findPncCourtCase"

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
  const matchingPncOffence = courtCase?.offences.find(
    (pncOffence) =>
      pncOffence.offence.sequenceNumber === Number(offence.CriminalProsecutionReference.OffenceReasonSequence)
  )

  const areAllDisposals2007 =
    matchingPncOffence?.disposals &&
    matchingPncOffence.disposals.length > 0 &&
    matchingPncOffence.disposals.every((disposal) => disposal.type === ADJOURNED_SINE_DIE_DISPOSAL_CODE)

  return areAllDisposals2007 ? matchingPncOffence.adjudication?.sentenceDate : undefined
}

export default getConvictionDateFromPncAdjudicationIfOffenceIsAdjournedSineDie
