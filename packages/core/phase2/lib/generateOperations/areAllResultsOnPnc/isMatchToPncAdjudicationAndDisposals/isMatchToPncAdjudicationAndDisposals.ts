import type { AnnotatedHearingOutcome, Offence } from "../../../../../types/AnnotatedHearingOutcome"
import areResultsMatchAPncDisposal from "./areResultsMatchingAPncDisposal"
import createPncAdjudicationFromAho from "./createPncAdjudicationFromAho"
import isMatchToPncAdjudication from "./isMatchToPncAdjudication"
import findPncCourtCase from "../../../findPncCourtCase"

const isMatchToPncAdjudicationAndDisposals = (aho: AnnotatedHearingOutcome, offence: Offence): boolean => {
  const offenceReasonSequence = offence.CriminalProsecutionReference?.OffenceReasonSequence ?? undefined
  const adjFromAho = createPncAdjudicationFromAho(
    offence.Result,
    aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing
  )

  return (
    !!adjFromAho &&
    !!findPncCourtCase(aho, offence)?.offences.some(
      (pncOffence) =>
        isMatchToPncAdjudication(adjFromAho, pncOffence, offenceReasonSequence) &&
        areResultsMatchAPncDisposal(offence, pncOffence.disposals ?? [])
    )
  )
}

export default isMatchToPncAdjudicationAndDisposals
