import type { ExceptionPath } from "src/types/Exception"

const nextResultSourceOrganisationPath = (offenceIndex: number, resultIndex: number): ExceptionPath => [
  "AnnotatedHearingOutcome",
  "HearingOutcome",
  "Case",
  "HearingDefendant",
  "Offence",
  offenceIndex,
  "Result",
  resultIndex,
  "NextResultSourceOrganisation",
  "OrganisationUnitCode"
]

export { nextResultSourceOrganisationPath }
