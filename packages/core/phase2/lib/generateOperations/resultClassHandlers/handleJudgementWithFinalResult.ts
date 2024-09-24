import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../lib/exceptions/errorPaths"
import type { Operation } from "../../../../types/PncUpdateDataset"
import ResultClass from "../../../../types/ResultClass"
import createOperation from "../createOperation"
import createSubsequentVariationOperation from "../createSubsequentVariationOperation"
import hasUnmatchedPncOffences from "../hasUnmatchedPncOffences"
import type { ResultClassHandler } from "./ResultClassHandler"
import { PncOperation } from "../../../../types/PncOperation"
import checkCaseRequiresRccButHasNoReportableOffences from "../checkCaseRequiresRccButHasNoReportableOffences"

export const handleJudgementWithFinalResult: ResultClassHandler = ({
  resubmitted,
  aho,
  allResultsAlreadyOnPnc,
  offenceIndex,
  resultIndex,
  offence,
  result
}) => {
  const fixedPenalty = !!aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber
  const ccrId = offence?.CourtCaseReferenceNumber || undefined
  const operationData = ccrId ? { courtCaseReference: ccrId } : undefined

  if (fixedPenalty) {
    return { operations: [createOperation(PncOperation.PENALTY_HEARING, operationData)], exceptions: [] }
  } else if (result.PNCAdjudicationExists) {
    return createSubsequentVariationOperation(
      resubmitted,
      aho,
      result.ResultClass === ResultClass.JUDGEMENT_WITH_FINAL_RESULT ? ExceptionCode.HO200104 : ExceptionCode.HO200101,
      allResultsAlreadyOnPnc,
      offenceIndex,
      resultIndex,
      operationData
    )
  }

  if (!allResultsAlreadyOnPnc && hasUnmatchedPncOffences(aho, ccrId) && !offence.AddedByTheCourt) {
    const exception = {
      code: ExceptionCode.HO200124,
      path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
    }
    return { operations: [], exceptions: [exception] }
  }

  const contains2007Result = !!offence?.Result.some((r) => r.PNCDisposalType === 2007)

  const operations: Operation[] = []
  if (!offence.AddedByTheCourt) {
    operations.push(createOperation(PncOperation.NORMAL_DISPOSAL, operationData))
  } else if (offence.AddedByTheCourt && !contains2007Result) {
    const operation = createOperation(PncOperation.NORMAL_DISPOSAL, operationData)
    // TODO: Refactor this
    if (operation.code === PncOperation.NORMAL_DISPOSAL) {
      operation.addedByTheCourt = true
    }

    operations.push(operation)
  }

  if (result.PNCDisposalType === 2060 && checkCaseRequiresRccButHasNoReportableOffences(aho, ccrId)) {
    const exception = {
      code: ExceptionCode.HO200108,
      path: errorPaths.offence(offenceIndex).result(resultIndex).resultClass
    }

    return { operations, exceptions: [exception] }
  }

  return { operations, exceptions: [] }
}
