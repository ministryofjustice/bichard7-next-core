import type { CourtResultMatchingSummary } from "src/comparison/types/MatchingComparisonOutput"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"

const extractSequenceNumbers = (aho: AnnotatedHearingOutcome): (string | undefined | null)[] =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.map(
    (o) => o.CriminalProsecutionReference.OffenceReasonSequence
  )

const offenceReasonSequenceFormat = (
  expected: CourtResultMatchingSummary,
  actual: CourtResultMatchingSummary,
  expectedAho: AnnotatedHearingOutcome,
  actualAho: AnnotatedHearingOutcome
): boolean => {
  if ("exceptions" in actual || "exceptions" in expected) {
    return false
  }

  const offenceMatchingMatches = JSON.stringify(expected) === JSON.stringify(actual)
  const expectedSequenceNumbers = extractSequenceNumbers(expectedAho)
  const actualSequenceNumbers = extractSequenceNumbers(actualAho)
  const sequenceNumbersMatch = JSON.stringify(expectedSequenceNumbers) === JSON.stringify(actualSequenceNumbers)
  const expectedSequenceNumbersAsNumber = expectedSequenceNumbers.map((n) => Number(n))
  const actualSequenceNumbersAsNumber = actualSequenceNumbers.map((n) => Number(n))
  const sequenceNumbersActuallyMatch =
    JSON.stringify(expectedSequenceNumbersAsNumber) === JSON.stringify(actualSequenceNumbersAsNumber)

  return offenceMatchingMatches && !sequenceNumbersMatch && sequenceNumbersActuallyMatch
}

export default offenceReasonSequenceFormat
