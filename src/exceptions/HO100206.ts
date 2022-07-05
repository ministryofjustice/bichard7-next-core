import errorPaths from "src/lib/errorPaths"
import { validateASN, validateDummyASN } from "src/schemas/ahoValidations"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { ExceptionGenerator } from "src/types/ExceptionGenerator"

const HO100206: ExceptionGenerator = (hearingOutcome) => {
  const asn = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  const generatedExceptions: Exception[] = []

  if (!validateASN(asn) && !validateDummyASN(asn)) {
    generatedExceptions.push({ code: ExceptionCode.HO100206, path: errorPaths.case.asn })
  }

  return generatedExceptions
}

export default HO100206
