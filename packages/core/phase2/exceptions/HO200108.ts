import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import ResultClass from "../../types/ResultClass"
import checkResultClassExceptions from "./checkResultClassExceptions"
import areAllPncResults2007 from "../lib/areAllPncResults2007"
import { areAllResultsOnPnc } from "../lib/generateOperations/areAllResultsOnPnc"

const generator: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []
  const fixedPenalty = aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber
  const allResultsAlreadyOnPnc = areAllResultsOnPnc(aho)
  
  if (fixedPenalty) {
    return []
  }

  checkResultClassExceptions(aho, (offence, result, offenceIndex, resultIndex) => {
    if (
      result.ResultClass === ResultClass.JUDGEMENT_WITH_FINAL_RESULT &&
      !result.PNCAdjudicationExists &&
      !offence.AddedByTheCourt &&
      !areAllPncResults2007(aho, offence?.CourtCaseReferenceNumber || undefined)
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
