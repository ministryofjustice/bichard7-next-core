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

export const offenceReasonPath = (offenceIndex: number): (string | number)[] => [
  "AnnotatedHearingOutcome",
  "HearingOutcome",
  "Case",
  "HearingDefendant",
  "Offence",
  offenceIndex,
  "CriminalProsecutionReference",
  "OffenceReason",
  "OffenceCode",
  "Reason"
]

export const resultQualifierVariableCodePath = (
  offenceIndex: number,
  resultIndex: number,
  resultQualifierVariableIndex: number
): (string | number)[] => [
  "AnnotatedHearingOutcome",
  "HearingOutcome",
  "Case",
  "HearingDefendant",
  "Offence",
  offenceIndex,
  "Result",
  resultIndex,
  "ResultQualifierVariable",
  resultQualifierVariableIndex,
  "Code"
]

export const amountSpecifiedInResultPath = (
  offenceIndex: number,
  resultIndex: number,
  amountSpecifiedInResultIndex: number
): (string | number)[] => [
  "AnnotatedHearingOutcome",
  "HearingOutcome",
  "Case",
  "HearingDefendant",
  "Offence",
  offenceIndex,
  "Result",
  resultIndex,
  "AmountSpecifiedInResult",
  amountSpecifiedInResultIndex
]

export const resultQualifierVariableDurationTypePath = (
  offenceIndex: number,
  resultIndex: number,
  resultQualifierVariableIndex: number
): (string | number)[] => [
  "AnnotatedHearingOutcome",
  "HearingOutcome",
  "Case",
  "HearingDefendant",
  "Offence",
  offenceIndex,
  "Result",
  resultIndex,
  "ResultQualifierVariable",
  resultQualifierVariableIndex,
  "Duration",
  "DurationType"
]
