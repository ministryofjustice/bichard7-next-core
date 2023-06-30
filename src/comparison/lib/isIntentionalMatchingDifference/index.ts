import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import summariseMatching from "tests/helpers/summariseMatching"
import badManualMatch from "./badManualMatch"
import badlyAnnotatedSingleCaseMatch from "./badlyAnnotatedSingleCaseMatch"
import convictionDateMatching from "./convictionDateMatching"
import coreMatchesBichardAddsInCourt from "./coreMatchesBichardAddsInCourt"
import coreUsesManualMatchData from "./coreUsesManualMatchData"
import ho100304WithExistingFinalOffence from "./ho100304WithExistingFinalOffence"
import ho100310AndHo100332Equivalent from "./ho100310AndHo100332Equivalent"
import ho100332NotHo100304 from "./ho100332NotHo100304"
import ho100332WithConvictionDate from "./ho100332WithConvictionDate"
import ho100332WithSameResults from "./ho100332WithSameResults"
import ho100333AndCCRHasLeadingZero from "./ho100333AndCCRHasLeadingZero"
import identicalOffenceSwitchedSequenceNumbers from "./identicalOffenceSwitchedSequenceNumbers"
import invalidManualSequenceNumber from "./invalidManualSequenceNumber"
import missingEmptyCcr from "./missingEmptyCcr"
import nonMatchingManualSequenceNumber from "./nonMatchingManualSequenceNumber"
import offenceReasonSequenceFormat from "./offenceReasonSequenceFormat"

const filters = [
  badlyAnnotatedSingleCaseMatch,
  badManualMatch,
  convictionDateMatching,
  coreMatchesBichardAddsInCourt,
  coreUsesManualMatchData,
  ho100304WithExistingFinalOffence,
  ho100310AndHo100332Equivalent,
  ho100332NotHo100304,
  ho100332WithConvictionDate,
  ho100332WithSameResults,
  ho100333AndCCRHasLeadingZero,
  identicalOffenceSwitchedSequenceNumbers,
  invalidManualSequenceNumber,
  nonMatchingManualSequenceNumber,
  offenceReasonSequenceFormat
]

const isIntentionalMatchingDifference = (
  expected: AnnotatedHearingOutcome,
  actual: AnnotatedHearingOutcome,
  incoming: AnnotatedHearingOutcome
): boolean => {
  const expectedMatch = summariseMatching(expected, true)
  const actualMatch = summariseMatching(actual, true)

  if (missingEmptyCcr(expectedMatch, actualMatch, expected, actual, incoming)) {
    return true
  }

  if (!expectedMatch || !actualMatch) {
    return false
  }

  const filterResults = filters.map((filter) => filter(expectedMatch, actualMatch, expected, actual, incoming))

  return filterResults.some((result) => result)
}

export default isIntentionalMatchingDifference
