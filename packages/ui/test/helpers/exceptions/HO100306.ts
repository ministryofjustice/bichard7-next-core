import ExceptionCode from "@moj-bichard7/standing-data/types/ExceptionCode"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

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
