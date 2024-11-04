import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import ResultClass from "../../types/ResultClass"
import areAllResultsOnPnc from "../lib/areAllResultsOnPnc"
import hasUnmatchedPncOffences from "../lib/hasUnmatchedPncOffences"
import checkResultClassExceptions from "./checkResultClassExceptions"
import errorPaths from "../../lib/exceptions/errorPaths"

const HO200124: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []
  const fixedPenalty = aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber
  const allResultsOnPnc = areAllResultsOnPnc(aho)

  if (fixedPenalty || allResultsOnPnc) {
    return []
  }

  checkResultClassExceptions(aho, (offence, result, offenceIndex, resultIndex) => {
    const ccrId = offence?.CourtCaseReferenceNumber || undefined

    if (result.PNCAdjudicationExists) {
      return
    }

    if (
      result.ResultClass &&
      [ResultClass.JUDGEMENT_WITH_FINAL_RESULT, ResultClass.ADJOURNMENT_WITH_JUDGEMENT].includes(result.ResultClass) &&
      hasUnmatchedPncOffences(aho, ccrId) &&
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
