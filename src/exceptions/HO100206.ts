import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { ExceptionGenerator } from "src/types/ExceptionGenerator"
import { asnPath } from "src/use-cases/enrichHearingOutcome/enrichFunctions/enrichCourtCases/errorPaths"
import { validateASN, validateDummyASN } from "src/use-cases/validations"

const HO100206: ExceptionGenerator = (hearingOutcome) => {
  const asn = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  const generatedExceptions: Exception[] = []

  if (!validateASN(asn) && !validateDummyASN(asn)) {
    generatedExceptions.push({ code: ExceptionCode.HO100206, path: asnPath })
  }

  return generatedExceptions
}

export default HO100206
