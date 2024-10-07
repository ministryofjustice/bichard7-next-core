import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../lib/exceptions/errorPaths"
import type { Operation } from "../../../../types/PncUpdateDataset"
import createOperation from "../createOperation"
import hasUnmatchedPncOffences from "../hasUnmatchedPncOffences"
import type { ResultClassHandler } from "./ResultClassHandler"
import { PncOperation } from "../../../../types/PncOperation"
import checkCaseRequiresRccButHasNoReportableOffences from "../checkCaseRequiresRccButHasNoReportableOffences"
import areAllPncResults2007 from "../../areAllPncResults2007"

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
    const operations =
      resubmitted || areAllPncResults2007(aho, operationData?.courtCaseReference)
        ? [createOperation(PncOperation.DISPOSAL_UPDATED, operationData)]
        : []
    return { operations, exceptions: [] }
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
