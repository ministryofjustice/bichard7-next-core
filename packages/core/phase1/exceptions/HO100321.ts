import { ExceptionCode } from "../../types/ExceptionCode"
import errorPaths from "../lib/errorPaths"
import { isAsnFormatValid } from "../lib/isAsnValid"
import isDummyAsn from "../lib/isDummyAsn"
import type Exception from "../types/Exception"
import type { ExceptionGenerator } from "../types/ExceptionGenerator"

const HO100321: ExceptionGenerator = (hearingOutcome) => {
  const recordableOnPNCindicator = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator
  const asn = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  const generatedExceptions: Exception[] = []

  if (recordableOnPNCindicator && isDummyAsn(asn) && isAsnFormatValid(asn)) {
    generatedExceptions.push({ code: ExceptionCode.HO100321, path: errorPaths.case.asn })
  }

  return generatedExceptions
}

export default HO100321
