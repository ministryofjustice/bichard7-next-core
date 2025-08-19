import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "@moj-bichard7/common/aho/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

export default function (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome {
  aho.Exceptions.push({
    code: ExceptionCode.HO100332,
    path: [
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "Offence",
      0,
      "CriminalProsecutionReference",
      "OffenceReasonSequence"
    ]
  })
  aho.Exceptions.push({
    code: ExceptionCode.HO100304,
    path: errorPaths.case.asn
  })

  return aho
}
