import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import ResultClass from "@moj-bichard7/common/types/ResultClass"

import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import errorPaths from "../../lib/exceptions/errorPaths"
import checkResultClassExceptions from "./checkResultClassExceptions"

const HO200103: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
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

export default HO200103
