import { PncOperation } from "@moj-bichard7/common/types/PncOperation"

import type { ResultClassHandler } from "./ResultClassHandler"

import areAllPoliceDisposalsWithType from "../../areAllPoliceDisposalsWithType"
import hasUnmatchedPoliceOffences from "../../hasUnmatchedPoliceOffences"
import createOperation from "../createOperation"

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
  }

  if (result.PNCAdjudicationExists) {
    return resubmitted || areAllPoliceDisposalsWithType(aho, offence, 2007)
      ? [createOperation(PncOperation.DISPOSAL_UPDATED, operationData)]
      : []
  }

  if (!areAllResultsOnPnc && hasUnmatchedPoliceOffences(aho, courtCaseReference) && !offence.AddedByTheCourt) {
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
