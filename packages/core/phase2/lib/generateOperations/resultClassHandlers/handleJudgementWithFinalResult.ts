import type { Operation } from "../../../../types/PncUpdateDataset"
import createOperation from "../createOperation"
import hasUnmatchedPncOffences from "../hasUnmatchedPncOffences"
import type { ResultClassHandler } from "./ResultClassHandler"
import { PncOperation } from "../../../../types/PncOperation"
import areAllPncResults2007 from "../../areAllPncResults2007"

export const handleJudgementWithFinalResult: ResultClassHandler = ({
  resubmitted,
  aho,
  allResultsOnPnc,
  offence,
  result
}) => {
  const fixedPenalty = !!aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber
  const ccrId = offence?.CourtCaseReferenceNumber || undefined
  const operationData = ccrId ? { courtCaseReference: ccrId } : undefined

  if (fixedPenalty) {
    return [createOperation(PncOperation.PENALTY_HEARING, operationData)]
  } else if (result.PNCAdjudicationExists) {
    return resubmitted || areAllPncResults2007(aho, operationData?.courtCaseReference)
      ? [createOperation(PncOperation.DISPOSAL_UPDATED, operationData)]
      : []
  }

  if (!allResultsOnPnc && hasUnmatchedPncOffences(aho, ccrId) && !offence.AddedByTheCourt) {
    return []
  }

  const contains2007Result = !!offence?.Result.some((r) => r.PNCDisposalType === 2007)

  const operations: Operation[] = []
  if (!offence.AddedByTheCourt) {
    operations.push(createOperation(PncOperation.NORMAL_DISPOSAL, operationData))
  } else if (offence.AddedByTheCourt && !contains2007Result) {
    operations.push({
      ...createOperation(PncOperation.NORMAL_DISPOSAL, operationData),
      addedByTheCourt: true
    })
  }

  return operations
}
