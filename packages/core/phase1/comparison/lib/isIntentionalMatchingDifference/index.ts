import summariseMatching from "phase1/tests/helpers/summariseMatching"
import type { AnnotatedHearingOutcome } from "types/AnnotatedHearingOutcome"
import badManualMatch from "phase1/comparison/lib/isIntentionalMatchingDifference/badManualMatch"
import badlyAnnotatedSingleCaseMatch from "phase1/comparison/lib/isIntentionalMatchingDifference/badlyAnnotatedSingleCaseMatch"
import convictionDateMatching from "phase1/comparison/lib/isIntentionalMatchingDifference/convictionDateMatching"
import coreMatchesBichardAddsInCourt from "phase1/comparison/lib/isIntentionalMatchingDifference/coreMatchesBichardAddsInCourt"
import coreUsesManualMatchData from "phase1/comparison/lib/isIntentionalMatchingDifference/coreUsesManualMatchData"
import fixedForce91 from "phase1/comparison/lib/isIntentionalMatchingDifference/fixedForce91"
import fixedNumberOfOffencesTic from "phase1/comparison/lib/isIntentionalMatchingDifference/fixedNumberOfOffencesTic"
import ho100304WithExistingFinalOffence from "phase1/comparison/lib/isIntentionalMatchingDifference/ho100304WithExistingFinalOffence"
import ho100310AndHo100332Equivalent from "phase1/comparison/lib/isIntentionalMatchingDifference/ho100310AndHo100332Equivalent"
import ho100332NotHo100304 from "phase1/comparison/lib/isIntentionalMatchingDifference/ho100332NotHo100304"
import ho100332WithConvictionDate from "phase1/comparison/lib/isIntentionalMatchingDifference/ho100332WithConvictionDate"
import ho100332WithSameResults from "phase1/comparison/lib/isIntentionalMatchingDifference/ho100332WithSameResults"
import ho100333AndCCRHasLeadingZero from "phase1/comparison/lib/isIntentionalMatchingDifference/ho100333AndCCRHasLeadingZero"
import identicalOffenceSwitchedSequenceNumbers from "phase1/comparison/lib/isIntentionalMatchingDifference/identicalOffenceSwitchedSequenceNumbers"
import invalidManualSequenceNumber from "phase1/comparison/lib/isIntentionalMatchingDifference/invalidManualSequenceNumber"
import missingEmptyCcr from "phase1/comparison/lib/isIntentionalMatchingDifference/missingEmptyCcr"
import nonMatchingManualSequenceNumber from "phase1/comparison/lib/isIntentionalMatchingDifference/nonMatchingManualSequenceNumber"
import offenceReasonSequenceFormat from "phase1/comparison/lib/isIntentionalMatchingDifference/offenceReasonSequenceFormat"
import prioritiseNonFinal from "phase1/comparison/lib/isIntentionalMatchingDifference/prioritiseNonFinal"
import trailingSpace from "phase1/comparison/lib/isIntentionalMatchingDifference/trailingSpace"

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
  offenceReasonSequenceFormat,
  prioritiseNonFinal
]

const isIntentionalMatchingDifference = (
  expected: AnnotatedHearingOutcome,
  actual: AnnotatedHearingOutcome,
  incoming: AnnotatedHearingOutcome
): boolean => {
  const expectedMatch = summariseMatching(expected, true)
  const actualMatch = summariseMatching(actual, true)

  if (
    fixedForce91(expectedMatch, actualMatch, expected, actual, incoming) ||
    fixedNumberOfOffencesTic(expectedMatch, actualMatch, expected, actual, incoming) ||
    missingEmptyCcr(expectedMatch, actualMatch, expected, actual, incoming) ||
    trailingSpace(expectedMatch, actualMatch, expected, actual, incoming)
  ) {
    return true
  }

  if (!expectedMatch || !actualMatch) {
    return false
  }

  const filterResults = filters.map((filter) => filter(expectedMatch, actualMatch, expected, actual, incoming))

  return filterResults.some((result) => result)
}

export default isIntentionalMatchingDifference
