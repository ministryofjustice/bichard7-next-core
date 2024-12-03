import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"

export default function (aho: AnnotatedHearingOutcome, offenceIndex = 0, resultIndex = 0): AnnotatedHearingOutcome {
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].CJSresultCode = 2050
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].Verdict = "NOT GUILTY"
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0].NextResultSourceOrganisation = {
    TopLevelCode: "A",
    SecondLevelCode: "01",
    ThirdLevelCode: "01",
    BottomLevelCode: "00",
    OrganisationUnitCode: "A010100"
  }

  aho.Exceptions.push({
    code: ExceptionCode.HO100305,
    path: [
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
  })

  return aho
}
