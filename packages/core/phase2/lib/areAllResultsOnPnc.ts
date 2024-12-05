import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"

import areResultsMatchingPncAdjudicationAndDisposals from "./areResultsMatchingPncAdjudicationAndDisposals"

const areAllResultsOnPnc = (aho: AnnotatedHearingOutcome): boolean =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.every((offence) =>
    areResultsMatchingPncAdjudicationAndDisposals(aho, offence)
  )

export default areAllResultsOnPnc
