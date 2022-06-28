import type { ExceptionPath } from "src/types/Exception"

export const offenceReasonSequencePath = (offenceIndex: number): ExceptionPath => [
  "AnnotatedHearingOutcome",
  "HearingOutcome",
  "Case",
  "HearingDefendant",
  "Offence",
  offenceIndex,
  "CriminalProsecutionReference",
  "OffenceReasonSequence"
]

export const asnPath = ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]

export const offenceResultClassPath = (offenceIndex: number, resultIndex: number): ExceptionPath => [
  "AnnotatedHearingOutcome",
  "HearingOutcome",
  "Case",
  "HearingDefendant",
  "Offence",
  offenceIndex,
  "Result",
  resultIndex,
  "ResultClass"
]
