import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import errorPaths from "../../lib/exceptions/errorPaths"
import isDummyAsn from "../../lib/isDummyAsn"

const HO200110: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const asn = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  if (aho.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator && isDummyAsn(asn)) {
    return [{ code: ExceptionCode.HO200110, path: errorPaths.case.asn }]
  }

  return []
}

export default HO200110
