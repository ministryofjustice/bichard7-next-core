import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type { CheckExceptionFn } from "../lib/areResultsMatchingPncAdjudicationAndDisposals"

import areResultsMatchingPncAdjudicationAndDisposals from "../lib/areResultsMatchingPncAdjudicationAndDisposals"

const checkResultsMatchingPncDisposalsExceptions = (
  aho: AnnotatedHearingOutcome,
  checkExceptionFn: CheckExceptionFn
): void => {
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.every((offence, offenceIndex) =>
    areResultsMatchingPncAdjudicationAndDisposals(aho, offence, offenceIndex, checkExceptionFn)
  )
}

export default checkResultsMatchingPncDisposalsExceptions
