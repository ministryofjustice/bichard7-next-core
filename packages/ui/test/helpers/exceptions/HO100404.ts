import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"

import errorPaths from "@moj-bichard7/core/lib/exceptions/errorPaths"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { sample } from "lodash"

const possiblePncErrorMessages = ["I6001", "I6002", "PNCAM", "PNCUE"]

export default function (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome {
  aho.PncErrorMessage = `${sample(possiblePncErrorMessages)} - THIS IS A PNC ERROR MESSAGE`
  aho.Exceptions.push({
    code: ExceptionCode.HO100404,
    path: errorPaths.case.asn
  })

  return aho
}
