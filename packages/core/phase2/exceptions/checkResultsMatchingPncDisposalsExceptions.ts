import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type { CheckExceptionFn } from "../lib/isMatchToPncAdjudicationAndDisposals"
import isMatchToPncAdjudicationAndDisposals from "../lib/isMatchToPncAdjudicationAndDisposals"

const checkResultsMatchingPncDisposalsExceptions = (
  aho: AnnotatedHearingOutcome,
  checkExceptionFn: CheckExceptionFn
): void => {
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.every((offence, offenceIndex) =>
    isMatchToPncAdjudicationAndDisposals(aho, offence, offenceIndex, checkExceptionFn)
  )
}

export default checkResultsMatchingPncDisposalsExceptions
