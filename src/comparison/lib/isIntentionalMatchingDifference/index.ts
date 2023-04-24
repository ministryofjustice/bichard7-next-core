import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import summariseMatching from "tests/helpers/summariseMatching"
import badlyAnnotatedSingleCaseMatch from "./badlyAnnotatedSingleCaseMatch"
import identicalOffenceSwitchedSequenceNumbers from "./identicalOffenceSwitchedSequenceNumbers"
import invalidManualSequenceNumber from "./invalidManualSequenceNumber"
import nonMatchingManualSequenceNumber from "./nonMatchingManualSequenceNumber"
import perfectMatchHo100304 from "./perfectMatchHo100304"
import perfectMatchHo100310 from "./perfectMatchHo100310"
import perfectMatchSwitchedSequenceNumbers from "./perfectMatchSwitchedSequenceNumbers"

const filters = [
  badlyAnnotatedSingleCaseMatch,
  identicalOffenceSwitchedSequenceNumbers,
  invalidManualSequenceNumber,
  nonMatchingManualSequenceNumber,
  perfectMatchHo100304,
  perfectMatchHo100310,
  perfectMatchSwitchedSequenceNumbers
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
