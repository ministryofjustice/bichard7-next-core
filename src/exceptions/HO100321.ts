import errorPaths from "src/lib/errorPaths"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { ExceptionGenerator } from "src/types/ExceptionGenerator"
import { validateDummyASN } from "src/use-cases/validations"

const HO100321: ExceptionGenerator = (hearingOutcome) => {
  const recordableOnPNCindicator = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator
  const asn = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  const generatedExceptions: Exception[] = []

  if (recordableOnPNCindicator && validateDummyASN(asn)) {
    generatedExceptions.push({ code: ExceptionCode.HO100321, path: errorPaths.case.asn })
  }

  return generatedExceptions
}

export default HO100321
