import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "@moj-bichard7/core/lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import { sample } from "lodash"

const possiblePncErrorMessages = [
  "I0007",
  "I0008",
  "I0014",
  "I0015",
  "I0021",
  "I0023",
  "I0031",
  "I0036",
  "I1001",
  "I1041",
  "I6001",
  "I6002"
]

export default function (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome {
  aho.Exceptions.push({
    code: ExceptionCode.HO100314,
    path: errorPaths.case.asn,
    message: `${sample(possiblePncErrorMessages)} - THIS IS A PNC ERROR MESSAGE`
  })

  return aho
}
