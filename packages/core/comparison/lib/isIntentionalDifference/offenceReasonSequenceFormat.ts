import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"
import type { ComparisonData } from "../../types/ComparisonData"
import { checkIntentionalDifferenceForPhases } from "./index"

const extractSequenceNumbers = (aho: AnnotatedHearingOutcome): (string | undefined | null)[] =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.map(
    (o) => o.CriminalProsecutionReference.OffenceReasonSequence
  )

const offenceReasonSequenceFormat = ({ expected, actual, phase }: ComparisonData) =>
  checkIntentionalDifferenceForPhases([1], phase, (): boolean => {
    const expectedMatchingSummary = expected.courtResultMatchingSummary as CourtResultMatchingSummary
    const actualMatchingSummary = actual.courtResultMatchingSummary as CourtResultMatchingSummary

    if ("exceptions" in actualMatchingSummary || "exceptions" in expectedMatchingSummary) {
      return false
    }

    const offenceMatchingMatches = JSON.stringify(expectedMatchingSummary) === JSON.stringify(actualMatchingSummary)
    const expectedSequenceNumbers = extractSequenceNumbers(expected.aho)
    const actualSequenceNumbers = extractSequenceNumbers(actual.aho)
    const sequenceNumbersMatch = JSON.stringify(expectedSequenceNumbers) === JSON.stringify(actualSequenceNumbers)
    const expectedSequenceNumbersAsNumber = expectedSequenceNumbers.map((n) => Number(n))
    const actualSequenceNumbersAsNumber = actualSequenceNumbers.map((n) => Number(n))
    const sequenceNumbersActuallyMatch =
      JSON.stringify(expectedSequenceNumbersAsNumber) === JSON.stringify(actualSequenceNumbersAsNumber)

    return offenceMatchingMatches && !sequenceNumbersMatch && sequenceNumbersActuallyMatch
  })

export default offenceReasonSequenceFormat
