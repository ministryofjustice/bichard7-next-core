import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"

export default function (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome {
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].ActualOffenceWording = ""
  aho.Exceptions.push({
    code: ExceptionCode.HO100234,
    path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Offence", "ActualOffenceWording"]
  })

  return aho
}
