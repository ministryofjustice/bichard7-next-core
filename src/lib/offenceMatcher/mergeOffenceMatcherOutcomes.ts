import type { OffenceMatcherOutcome } from "./offenceMatcher"

const mergeOffenceMatcherOutcomes = (
  outcome1: OffenceMatcherOutcome,
  outcome2: OffenceMatcherOutcome
): OffenceMatcherOutcome => ({
  allPncOffencesMatched: outcome1.allPncOffencesMatched && outcome2.allPncOffencesMatched,
  duplicateHoOffences: outcome1.duplicateHoOffences.concat(outcome2.duplicateHoOffences),
  matchedOffences: outcome1.matchedOffences.concat(outcome2.matchedOffences),
  pncOffencesMatchedIncludingDuplicates: outcome1.pncOffencesMatchedIncludingDuplicates.concat(
    outcome2.pncOffencesMatchedIncludingDuplicates
  ),
  nonMatchingExplicitMatches: outcome1.nonMatchingExplicitMatches.concat(outcome2.nonMatchingExplicitMatches)
})

export default mergeOffenceMatcherOutcomes
