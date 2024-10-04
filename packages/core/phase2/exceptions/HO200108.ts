import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import ResultClass from "../../types/ResultClass"
import checkResultClassExceptions from "./checkResultClassExceptions"
import areAllPncResults2007 from "../lib/areAllPncResults2007"
import { areAllResultsOnPnc } from "../lib/generateOperations/areAllResultsOnPnc"
import checkCaseRequiresRccButHasNoReportableOffences from "../lib/generateOperations/checkCaseRequiresRccButHasNoReportableOffences"
import hasUnmatchedPncOffences from "../lib/generateOperations/hasUnmatchedPncOffences"

const generator: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []
  const fixedPenalty = !!aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber
  const allResultsAlreadyOnPnc = areAllResultsOnPnc(aho)

  if (fixedPenalty) {
    return []
  }

  checkResultClassExceptions(aho, (offence, result, offenceIndex, resultIndex) => {
    const ccrId = offence?.CourtCaseReferenceNumber || undefined

    if (!allResultsAlreadyOnPnc && hasUnmatchedPncOffences(aho, ccrId) && !offence.AddedByTheCourt) {
      return
    }

    if (result.PNCAdjudicationExists || areAllPncResults2007(aho, ccrId)) {
      return
    }

    if (
      (result.ResultClass === ResultClass.JUDGEMENT_WITH_FINAL_RESULT ||
        result.ResultClass === ResultClass.ADJOURNMENT_WITH_JUDGEMENT) &&
      result.PNCDisposalType === 2060 &&
      checkCaseRequiresRccButHasNoReportableOffences(aho, ccrId)
    ) {
      const exception = {
        code: ExceptionCode.HO200108,
        path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
      }
      exceptions.push(exception)
    }
  })

  return exceptions
}

export default generator
