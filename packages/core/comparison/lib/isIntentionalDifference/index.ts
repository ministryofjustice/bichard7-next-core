import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../../../types/PncUpdateDataset"
import type { IntentionalDifference } from "../../types/IntentionalDifference"
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
  incomingMessage: AnnotatedHearingOutcome | PncUpdateDataset
): boolean => {
  const intentionalDifference: IntentionalDifference = {
    expected: { aho: expected, courtResultMatchingSummary: summariseMatching(expected, true) },
    actual: { aho: actual, courtResultMatchingSummary: summariseMatching(actual, true) },
    incomingMessage
  }

  // Check for differences in the AHO first
  if (
    doubleSpacesInNames(intentionalDifference) ||
    fixedForce91(intentionalDifference) ||
    fixedNumberOfOffencesTic(intentionalDifference) ||
    invalidASN(intentionalDifference) ||
    missingEmptyCcr(intentionalDifference) ||
    trailingSpace(intentionalDifference)
  ) {
    return true
  }

  // Then check for matching differences
  if (
    !intentionalDifference.expected.courtResultMatchingSummary ||
    !intentionalDifference.actual.courtResultMatchingSummary
  ) {
    return false
  }

  const filterResults = filters.map((filter) => filter(intentionalDifference))

  return filterResults.some((result) => result)
}

export default isIntentionalDifference
