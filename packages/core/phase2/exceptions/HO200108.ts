import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import ResultClass from "../../types/ResultClass"
import areAllResultsOnPnc from "../lib/areAllResultsOnPnc"
import hasUnmatchedPncOffences from "../lib/hasUnmatchedPncOffences"
import checkCaseRequiresRccButHasNoReportableOffences from "./checkCaseRequiresRccButHasNoReportableOffences"
import checkResultClassExceptions from "./checkResultClassExceptions"

const HO200108: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []
  const fixedPenalty = !!aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber
  const allResultsOnPnc = areAllResultsOnPnc(aho)

  if (fixedPenalty) {
    return []
  }

  checkResultClassExceptions(aho, (offence, result, offenceIndex, resultIndex) => {
    const courtCaseReference = offence?.CourtCaseReferenceNumber || undefined

    if (
      result.PNCAdjudicationExists ||
      (!allResultsOnPnc && hasUnmatchedPncOffences(aho, courtCaseReference) && !offence.AddedByTheCourt)
    ) {
      return
    }

    if (
      result.ResultClass &&
      [ResultClass.JUDGEMENT_WITH_FINAL_RESULT, ResultClass.ADJOURNMENT_WITH_JUDGEMENT].includes(result.ResultClass) &&
      result.PNCDisposalType === 2060 &&
      checkCaseRequiresRccButHasNoReportableOffences(aho, courtCaseReference)
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

export default HO200108
