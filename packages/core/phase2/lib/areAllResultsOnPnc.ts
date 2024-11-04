import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import isMatchToPncAdjudicationAndDisposals from "./isMatchToPncAdjudicationAndDisposals"

const areAllResultsOnPnc = (aho: AnnotatedHearingOutcome): boolean =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.every((offence) =>
    isMatchToPncAdjudicationAndDisposals(aho, offence)
  )

export default areAllResultsOnPnc
