import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import summariseMatching from "tests/helpers/summariseMatching"
import invalidManualSequenceNumber from "./invalidManualSequenceNumber"
import perfectMatchHo100304 from "./perfectMatchHo100304"
import perfectMatchHo100310 from "./perfectMatchHo100310"
import perfectMatchSwitchedSequenceNumbers from "./perfectMatchSwitchedSequenceNumbers"

const filters = [
  perfectMatchHo100310,
  perfectMatchHo100304,
  perfectMatchSwitchedSequenceNumbers,
  invalidManualSequenceNumber
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
