import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import summariseMatching from "../summariseMatching"
import badManualMatch from "./badManualMatch"
import badlyAnnotatedSingleCaseMatch from "./badlyAnnotatedSingleCaseMatch"
import bichardMatchesRandomFinalOffence from "./bichardMatchesRandomFinalOffence"
import convictionDateMatching from "./convictionDateMatching"
import coreMatchesBichardAddsInCourt from "./coreMatchesBichardAddsInCourt"
import coreUsesManualMatchData from "./coreUsesManualMatchData"
import doubleSpacesInNames from "./doubleSpacesInNames"
import fixedForce91 from "./fixedForce91"
import fixedNumberOfOffencesTic from "./fixedNumberOfOffencesTic"
import ho100304WithExistingFinalOffence from "./ho100304WithExistingFinalOffence"
import ho100310AndHo100332Equivalent from "./ho100310AndHo100332Equivalent"
import ho100332NotHo100304 from "./ho100332NotHo100304"
import ho100332WithConvictionDate from "./ho100332WithConvictionDate"
import ho100332WithSameResults from "./ho100332WithSameResults"
import ho100333AndCCRHasLeadingZero from "./ho100333AndCCRHasLeadingZero"
import identicalOffenceSwitchedSequenceNumbers from "./identicalOffenceSwitchedSequenceNumbers"
import invalidASN from "./invalidASN"
import invalidManualSequenceNumber from "./invalidManualSequenceNumber"
import missingEmptyCcr from "./missingEmptyCcr"
import nonMatchingManualSequenceNumber from "./nonMatchingManualSequenceNumber"
import offenceReasonSequenceFormat from "./offenceReasonSequenceFormat"
import prioritiseNonFinal from "./prioritiseNonFinal"
import trailingSpace from "./trailingSpace"

const filters = [
  badlyAnnotatedSingleCaseMatch,
  badManualMatch,
  bichardMatchesRandomFinalOffence,
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

const isIntentionalDifference = (
  expected: AnnotatedHearingOutcome,
  actual: AnnotatedHearingOutcome,
  incoming: AnnotatedHearingOutcome
): boolean => {
  const expectedMatch = summariseMatching(expected, true)
  const actualMatch = summariseMatching(actual, true)

  // Check for differences in the AHO first
  if (
    doubleSpacesInNames(expectedMatch, actualMatch, expected, actual, incoming) ||
    fixedForce91(expectedMatch, actualMatch, expected, actual, incoming) ||
    fixedNumberOfOffencesTic(expectedMatch, actualMatch, expected, actual, incoming) ||
    invalidASN(expectedMatch, actualMatch, expected, actual, incoming) ||
    missingEmptyCcr(expectedMatch, actualMatch, expected, actual, incoming) ||
    trailingSpace(expectedMatch, actualMatch, expected, actual, incoming)
  ) {
    return true
  }

  // Then check for matching differences
  if (!expectedMatch || !actualMatch) {
    return false
  }

  const filterResults = filters.map((filter) => filter(expectedMatch, actualMatch, expected, actual, incoming))

  return filterResults.some((result) => result)
}

export default isIntentionalDifference
