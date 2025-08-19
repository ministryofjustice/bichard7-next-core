import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type Exception from "@moj-bichard7/common/types/Exception"

import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "@moj-bichard7/common/aho/exceptions/errorPaths"
import ResultClass from "@moj-bichard7/common/types/ResultClass"

import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import checkResultClassExceptions from "./checkResultClassExceptions"

const HO200106: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []
  const fixedPenalty = aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber

  if (fixedPenalty) {
    return []
  }

  checkResultClassExceptions(aho, (offence, result, offenceIndex, resultIndex) => {
    if (!result.PNCAdjudicationExists && !offence.AddedByTheCourt && result.ResultClass == ResultClass.SENTENCE) {
      const exception = {
        code: ExceptionCode.HO200106,
        path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
      }
      exceptions.push(exception)
    }
  })

  return exceptions
}

export default HO200106
