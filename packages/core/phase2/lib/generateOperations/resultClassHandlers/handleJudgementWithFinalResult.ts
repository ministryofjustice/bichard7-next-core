import type { Operation } from "../../../../types/PncUpdateDataset"
import createOperation from "../createOperation"
import hasUnmatchedPncOffences from "../../hasUnmatchedPncOffences"
import type { ResultClassHandler } from "./ResultClassHandler"
import { PncOperation } from "../../../../types/PncOperation"
import areAllPncResults2007 from "../../areAllPncResults2007"

export const handleJudgementWithFinalResult: ResultClassHandler = ({
  resubmitted,
  aho,
  areAllResultsOnPnc,
  offence,
  result
}) => {
  const fixedPenalty = !!aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber
  const courtCaseReference = offence?.CourtCaseReferenceNumber || undefined
  const operationData = courtCaseReference ? { courtCaseReference } : undefined

  if (fixedPenalty) {
    return [createOperation(PncOperation.PENALTY_HEARING, operationData)]
  } else if (result.PNCAdjudicationExists) {
    return resubmitted || areAllPncResults2007(aho, offence)
      ? [createOperation(PncOperation.DISPOSAL_UPDATED, operationData)]
      : []
  }

  if (!areAllResultsOnPnc && hasUnmatchedPncOffences(aho, courtCaseReference) && !offence.AddedByTheCourt) {
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
