import type { AnnotatedHearingOutcome, Offence } from "../../../../../types/AnnotatedHearingOutcome"
import { isNonEmptyArray } from "../../../../../types/NonEmptyArray"
import areResultsMatchAPncDisposal from "./areResultsMatchingAPncDisposal"
import createPncAdjudicationFromAho from "./createPncAdjudicationFromAho"
import isMatchToPncAdjudication from "./isMatchToPncAdjudication"
import findPncCourtCase from "../../../findPncCourtCase"

const isMatchToPncAdjudicationAndDisposals = (aho: AnnotatedHearingOutcome, offence: Offence): boolean => {
  if (!offence.Result || !isNonEmptyArray(offence.Result)) {
    return false
  }

  const offenceReasonSequence = offence.CriminalProsecutionReference?.OffenceReasonSequence ?? undefined
  const adjFromAho = createPncAdjudicationFromAho(
    offence.Result,
    aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing
  )

  return !!findPncCourtCase(aho, offence)?.offences.some(
    (pncOffence) =>
      isMatchToPncAdjudication(adjFromAho, pncOffence, offenceReasonSequence) &&
      areResultsMatchAPncDisposal(offence, pncOffence.disposals ?? [])
  )
}

export default isMatchToPncAdjudicationAndDisposals
