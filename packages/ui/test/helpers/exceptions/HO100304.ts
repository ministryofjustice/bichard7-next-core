import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"

import errorPaths from "@moj-bichard7/core/lib/exceptions/errorPaths"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

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
