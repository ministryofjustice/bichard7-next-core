import ResultClass from "@moj-bichard7-developers/bichard7-next-core/core/types/ResultClass"
import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

export default function (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome {
  const result = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].Result[0]
  result.PNCAdjudicationExists = false
  result.ResultClass = ResultClass.ADJOURNMENT_POST_JUDGEMENT

  aho.Exceptions.push({
    code: ExceptionCode.HO100325,
    path: [
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "Offence",
      0,
      "Result",
      0,
      "ResultClass"
    ]
  })

  return aho
}
