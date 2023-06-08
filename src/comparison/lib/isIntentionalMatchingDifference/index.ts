import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import summariseMatching from "tests/helpers/summariseMatching"
import badlyAnnotatedSingleCaseMatch from "./badlyAnnotatedSingleCaseMatch"
import convictionDateMatching from "./convictionDateMatching"
import ho100332NotHo100304 from "./ho100332NotHo100304"
import identicalOffenceSwitchedSequenceNumbers from "./identicalOffenceSwitchedSequenceNumbers"
import invalidManualSequenceNumber from "./invalidManualSequenceNumber"
import nonMatchingManualSequenceNumber from "./nonMatchingManualSequenceNumber"
import offenceReasonSequenceFormat from "./offenceReasonSequenceFormat"

const filters = [
  badlyAnnotatedSingleCaseMatch,
  convictionDateMatching,
  ho100332NotHo100304,
  identicalOffenceSwitchedSequenceNumbers,
  invalidManualSequenceNumber,
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
