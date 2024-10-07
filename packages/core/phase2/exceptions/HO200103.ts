import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import ResultClass from "../../types/ResultClass"
import checkResultClassExceptions from "./checkResultClassExceptions"

const generator: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []

  checkResultClassExceptions(aho, (offence, result, offenceIndex, resultIndex) => {
    if (
      result.ResultClass === ResultClass.ADJOURNMENT_POST_JUDGEMENT &&
      !result.PNCAdjudicationExists &&
      !offence.AddedByTheCourt
    ) {
      const exception = {
        code: ExceptionCode.HO200103,
        path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
      }
      exceptions.push(exception)
    }
  })

  return exceptions
}

export default generator
