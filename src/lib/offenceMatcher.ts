import type { Offence } from "src/types/AnnotatedHearingOutcome"
import type { PncOffence } from "src/types/PncQueryResult"

type OffenceMatch = {
  hoOffence: Offence
  pncOffence: PncOffence
}

type OffenceMatcherOutcome = {
  allPncOffencesMatched: boolean
  duplicateHoOffences: Offence[]
  matchedOffences: OffenceMatch[]
  pncOffencesMatchedIncludingDuplicates: PncOffence[]
  nonMatchingExplicitMatches: OffenceMatch[]
}

const matchOffences = (
  hoOffences: Offence[],
  pncOffences: PncOffence[],
  attemptManualMatch: boolean
): OffenceMatcherOutcome => {
  console.log(hoOffences, pncOffences, attemptManualMatch)
  return {
    allPncOffencesMatched: true,
    duplicateHoOffences: [],
    matchedOffences: [],
    pncOffencesMatchedIncludingDuplicates: [],
    nonMatchingExplicitMatches: []
  }
}

export { matchOffences, OffenceMatch, OffenceMatcherOutcome }
