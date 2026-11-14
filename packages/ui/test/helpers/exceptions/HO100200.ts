import ExceptionCode from "@moj-bichard7/standing-data/types/ExceptionCode"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

export default function (aho: AnnotatedHearingOutcome, offenceIndex = 2, resultIndex = 1): AnnotatedHearingOutcome {
  aho.Exceptions.push({
    code: ExceptionCode.HO100200,
    path: [
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
  })

  return aho
}
