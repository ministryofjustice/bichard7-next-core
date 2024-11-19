import type { ResultClassHandler } from "./ResultClassHandler"

import { PncOperation } from "../../../../types/PncOperation"
import areAllPncDisposalsWithType from "../../areAllPncDisposalsWithType"
import hasUnmatchedPncOffences from "../../hasUnmatchedPncOffences"
import createOperation from "../createOperation"

export const handleJudgementWithFinalResult: ResultClassHandler = ({
  aho,
  areAllResultsOnPnc,
  offence,
  resubmitted,
  result
}) => {
  const fixedPenalty = !!aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber
  const courtCaseReference = offence?.CourtCaseReferenceNumber || undefined
  const operationData = courtCaseReference ? { courtCaseReference } : undefined

  if (fixedPenalty) {
    return [createOperation(PncOperation.PENALTY_HEARING, operationData)]
  }

  if (result.PNCAdjudicationExists) {
    return resubmitted || areAllPncDisposalsWithType(aho, offence, 2007)
      ? [createOperation(PncOperation.DISPOSAL_UPDATED, operationData)]
      : []
  }

  if (!areAllResultsOnPnc && hasUnmatchedPncOffences(aho, courtCaseReference) && !offence.AddedByTheCourt) {
    return []
  }

  if (!offence.AddedByTheCourt) {
    return [createOperation(PncOperation.NORMAL_DISPOSAL, operationData)]
  }

  const contains2007Result = !!offence?.Result.some((r) => r.PNCDisposalType === 2007)
  if (offence.AddedByTheCourt && !contains2007Result) {
    return [
      {
        ...createOperation(PncOperation.NORMAL_DISPOSAL, operationData),
        addedByTheCourt: true
      }
    ]
  }

  return []
}
