import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../../lib/exceptions/errorPaths"
import ResultClass from "../../../../../types/ResultClass"
import addNewOperationToOperationSetIfNotPresent from "../../../addNewOperationToOperationSetIfNotPresent"
import addSubsequentVariationOperations from "../addSubsequentVariationOperations"
import checkRccSegmentApplicability, { RccSegmentApplicability } from "../checkRccSegmentApplicability"
import type { ResultClassHandler } from "../deriveOperationSequence"
import hasUnmatchedPncOffences from "../hasUnmatchedPncOffences"

export const handleJudgementWithFinalResult: ResultClassHandler = ({
  operations,
  resubmitted,
  aho,
  allResultsAlreadyOnPnc,
  offenceIndex,
  resultIndex,
  offence,
  result,
  oAacDisarrOperations
}) => {
  const fixedPenalty = aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber
  const ccrId = offence?.CourtCaseReferenceNumber || undefined
  const operationData = ccrId ? { courtCaseReference: ccrId } : undefined

  if (fixedPenalty) {
    addNewOperationToOperationSetIfNotPresent("PENHRG", operationData, operations)
    return
  } else if (result.PNCAdjudicationExists) {
    return addSubsequentVariationOperations(
      resubmitted,
      operations,
      aho,
      result.ResultClass === ResultClass.JUDGEMENT_WITH_FINAL_RESULT ? ExceptionCode.HO200104 : ExceptionCode.HO200101,
      allResultsAlreadyOnPnc,
      offenceIndex,
      resultIndex,
      operationData
    )
  }

  if (!allResultsAlreadyOnPnc && hasUnmatchedPncOffences(aho, ccrId) && !offence.AddedByTheCourt) {
    return {
      code: ExceptionCode.HO200124,
      path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
    }
  }

  const contains2007Result = !!offence?.Result.some((r) => r.PNCDisposalType === 2007)

  if (!offence.AddedByTheCourt) {
    addNewOperationToOperationSetIfNotPresent("DISARR", operationData, operations)
  } else if (offence.AddedByTheCourt && !contains2007Result) {
    addNewOperationToOperationSetIfNotPresent("DISARR", operationData, oAacDisarrOperations)
  }

  if (
    result.PNCDisposalType === 2060 &&
    checkRccSegmentApplicability(aho, ccrId) === RccSegmentApplicability.CaseRequiresRccButHasNoReportableOffences
  ) {
    return {
      code: ExceptionCode.HO200108,
      path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
    }
  }
}
