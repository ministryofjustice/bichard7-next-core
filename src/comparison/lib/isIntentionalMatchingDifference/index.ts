import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import summariseMatching from "tests/helpers/summariseMatching"
import badlyAnnotatedSingleCaseMatch from "./badlyAnnotatedSingleCaseMatch"
import ho100332NotHo100304 from "./ho100332NotHo100304"
import identicalOffenceSwitchedSequenceNumbers from "./identicalOffenceSwitchedSequenceNumbers"
import invalidManualSequenceNumber from "./invalidManualSequenceNumber"
import matchingToFinalOffences from "./matchingToFinalOffences"
import nonMatchingManualSequenceNumber from "./nonMatchingManualSequenceNumber"
import offenceReasonSequenceFormat from "./offenceReasonSequenceFormat"

const filters = [
  badlyAnnotatedSingleCaseMatch,
  ho100332NotHo100304,
  identicalOffenceSwitchedSequenceNumbers,
  invalidManualSequenceNumber,
  matchingToFinalOffences,
  nonMatchingManualSequenceNumber,
  offenceReasonSequenceFormat
]

const isIntentionalMatchingDifference = (
  expected: AnnotatedHearingOutcome,
  actual: AnnotatedHearingOutcome
): boolean => {
  const expectedMatch = summariseMatching(expected, true)
  const actualMatch = summariseMatching(actual, true)

  if (!expectedMatch || !actualMatch) {
    return false
  }

  return filters.some((filter) => filter(expectedMatch, actualMatch, expected, actual))
}

export default isIntentionalMatchingDifference
