import type { ExceptionPath } from "src/types/Exception"

const nextHearingDatePath = (offenceIndex: number, resultIndex: number): ExceptionPath => [
  "AnnotatedHearingOutcome",
  "HearingOutcome",
  "Case",
  "HearingDefendant",
  "Offence",
  offenceIndex,
  "Result",
  resultIndex,
  "NextHearingDate"
]

export { nextHearingDatePath }
