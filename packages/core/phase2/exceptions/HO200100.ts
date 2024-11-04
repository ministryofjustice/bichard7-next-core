import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import checkResultClassExceptions from "./checkResultClassExceptions"
import ResultClass from "../../types/ResultClass"

const HO200100: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []
  const fixedPenalty = aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber

  if (fixedPenalty) {
    return []
  }

  checkResultClassExceptions(aho, (_, result, offenceIndex, resultIndex) => {
    if (result.ResultClass === ResultClass.ADJOURNMENT_PRE_JUDGEMENT && result.PNCAdjudicationExists) {
      const exception = {
        code: ExceptionCode.HO200100,
        path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
      }
      exceptions.push(exception)
    }
  })

  return exceptions
}

export default HO200100
