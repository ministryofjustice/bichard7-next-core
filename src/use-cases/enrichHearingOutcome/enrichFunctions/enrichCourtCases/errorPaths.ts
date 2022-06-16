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
