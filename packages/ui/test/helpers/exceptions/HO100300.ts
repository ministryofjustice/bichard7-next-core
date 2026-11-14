import ExceptionCode from "@moj-bichard7/standing-data/types/ExceptionCode"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

export default function (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome {
  aho.Exceptions.push({
    code: ExceptionCode.HO100300,
    path: [
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "Offence",
      2,
      "Result",
      1,
      "NextResultSourceOrganisation",
      "OrganisationUnitCode"
    ]
  })

  return aho
}
