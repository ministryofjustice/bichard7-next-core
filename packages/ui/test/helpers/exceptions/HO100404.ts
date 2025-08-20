import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "@moj-bichard7/common/aho/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import { sample } from "lodash"

const possiblePncErrorMessages = ["I6001", "I6002", "PNCAM", "PNCUE"]

export default function (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome {
  aho.Exceptions.push({
    code: ExceptionCode.HO100404,
    path: errorPaths.case.asn,
    message: `${sample(possiblePncErrorMessages)} - THIS IS A PNC ERROR MESSAGE`
  })

  return aho
}
