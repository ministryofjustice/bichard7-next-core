import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

export default function (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome {
  aho.Exceptions.push({
    code: ExceptionCode.HO100306,
    path: [
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "Offence",
      0,
      "OffenceReason",
      "OffenceCode",
      "Reason"
    ]
  })

  aho.Exceptions.push({
    code: ExceptionCode.HO100306,
    path: [
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "Offence",
      0,
      "OffenceReason",
      "LocalOffenceCode",
      "OffenceCode"
    ]
  })

  return aho
}
