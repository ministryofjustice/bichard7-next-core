import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import areResultsMatchingPoliceAdjudicationAndDisposals from "./areResultsMatchingPoliceAdjudicationAndDisposals"

const areAllResultsInPoliceCourtCase = (aho: AnnotatedHearingOutcome): boolean =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.every((offence) =>
    areResultsMatchingPoliceAdjudicationAndDisposals(aho, offence)
  )

export default areAllResultsInPoliceCourtCase
