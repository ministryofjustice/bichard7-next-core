import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import areResultsMatchingPoliceAdjudicationAndDisposals from "./areResultsMatchingPoliceAdjudicationAndDisposals"

const areAllResultsOnPnc = (aho: AnnotatedHearingOutcome): boolean =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.every((offence) =>
    areResultsMatchingPoliceAdjudicationAndDisposals(aho, offence)
  )

export default areAllResultsOnPnc
