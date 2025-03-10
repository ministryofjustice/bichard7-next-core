import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"

export default function (aho: AnnotatedHearingOutcome, offenceIndex = 0, resultIndex = 0): AnnotatedHearingOutcome {
  aho.Exceptions.push({
    code: ExceptionCode.HO100102,
    path: [
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
  })

  return aho
}
