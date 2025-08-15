import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import ResultClass from "@moj-bichard7/common/types/ResultClass"
import errorPaths from "../../lib/exceptions/errorPaths"
import areAllResultsOnPnc from "../lib/areAllResultsOnPnc"
import hasUnmatchedPncOffences from "../lib/hasUnmatchedPncOffences"
import checkResultClassExceptions from "./checkResultClassExceptions"

const HO200124: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []
  const fixedPenalty = aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber
  const allResultsOnPnc = areAllResultsOnPnc(aho)

  if (fixedPenalty || allResultsOnPnc) {
    return []
  }

  checkResultClassExceptions(aho, (offence, result, offenceIndex, resultIndex) => {
    const courtCaseReference = offence?.CourtCaseReferenceNumber || undefined

    if (result.PNCAdjudicationExists) {
      return
    }

    if (
      result.ResultClass &&
      [ResultClass.ADJOURNMENT_WITH_JUDGEMENT, ResultClass.JUDGEMENT_WITH_FINAL_RESULT].includes(result.ResultClass) &&
      hasUnmatchedPncOffences(aho, courtCaseReference) &&
      !offence.AddedByTheCourt
    ) {
      const exception = {
        code: ExceptionCode.HO200124,
        path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
      }
      exceptions.push(exception)
    }
  })

  return exceptions
}

export default HO200124
