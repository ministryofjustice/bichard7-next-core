import addExceptionsToAho from "../../../phase1/exceptions/addExceptionsToAho"
import errorPaths from "../../../phase1/lib/errorPaths"
import ResultClass from "../../../phase1/types/ResultClass"
import { ExceptionCode } from "../../../types/ExceptionCode"
import addNewOperationToOperationSetIfNotPresent from "../../addNewOperationToOperationSetIfNotPresent"
import addSubsequentVariationOperations from "./addSubsequentVariationOperations"
import checkRccSegmentApplicability, { RccSegmentApplicability } from "./checkRccSegmentApplicability"
import type { ResultClassHandler } from "./deriveOperationSequence"
import hasUnmatchedPncOffences from "./hasUnmatchedPncOffences"

export const handleJudgementWithFinalResult: ResultClassHandler = ({
  fixedPenalty,
  ccrId,
  operations,
  adjudicationExists,
  resubmitted,
  aho,
  allResultsAlreadyOnPnc,
  offenceIndex,
  resultIndex,
  pncDisposalCode,
  offence,
  result,
  contains2007Result,
  oAacDisarrOperations
}) => {
  if (fixedPenalty) {
    addNewOperationToOperationSetIfNotPresent("PENHRG", ccrId ? { courtCaseReference: ccrId } : undefined, operations)
  } else if (adjudicationExists) {
    addSubsequentVariationOperations(
      resubmitted,
      operations,
      aho,
      result.ResultClass === ResultClass.JUDGEMENT_WITH_FINAL_RESULT ? ExceptionCode.HO200104 : ExceptionCode.HO200101,
      allResultsAlreadyOnPnc,
      offenceIndex,
      resultIndex,
      ccrId ? { courtCaseReference: ccrId } : undefined
    )
  } else {
    if (
      pncDisposalCode === 2060 &&
      checkRccSegmentApplicability(aho, ccrId) === RccSegmentApplicability.CaseRequiresRccButHasNoReportableOffences
    ) {
      addExceptionsToAho(aho, ExceptionCode.HO200108, errorPaths.offence(offenceIndex).result(resultIndex).resultClass)
    }

    if (!allResultsAlreadyOnPnc && hasUnmatchedPncOffences(aho, ccrId) && !offence.AddedByTheCourt) {
      addExceptionsToAho(aho, ExceptionCode.HO200124, errorPaths.offence(offenceIndex).result(resultIndex).resultClass)
    } else {
      if (!offence.AddedByTheCourt) {
        addNewOperationToOperationSetIfNotPresent(
          "DISARR",
          ccrId ? { courtCaseReference: ccrId } : undefined,
          operations
        )
      } else if (offence.AddedByTheCourt && !contains2007Result) {
        addNewOperationToOperationSetIfNotPresent(
          "DISARR",
          ccrId ? { courtCaseReference: ccrId } : undefined,
          oAacDisarrOperations
        )
      }
    }
  }
}
