export const offenceReasonSequencePath = (offenceIndex: number): (number | string)[] => [
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

export const offenceResultClassPath = (offenceIndex: number, resultIndex: number): (string | number)[] => [
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
