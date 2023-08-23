import { ExceptionCode } from "types/ExceptionCode"
import errorPaths from "phase1/lib/errorPaths"
import { isAsnFormatValid } from "phase1/lib/isAsnValid"
import isDummyAsn from "phase1/lib/isDummyAsn"
import type Exception from "phase1/types/Exception"
import type { ExceptionGenerator } from "phase1/types/ExceptionGenerator"

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
