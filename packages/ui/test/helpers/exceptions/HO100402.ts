import errorPaths from "@moj-bichard7-developers/bichard7-next-core/core/lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { range, sample } from "lodash"

const possiblePncErrorMessages = [
  "I0001",
  "I0002",
  "I0003",
  "I0004",
  "I0005",
  "I0017",
  "I0024",
  "I0030",
  ...range(1001, 1042).map((m) => `I${m}`)
]

export default function (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome {
  aho.PncErrorMessage = `${sample(possiblePncErrorMessages)} - THIS IS A PNC ERROR MESSAGE`
  aho.Exceptions.push({
    code: ExceptionCode.HO100402,
    path: errorPaths.case.asn
  })

  return aho
}
