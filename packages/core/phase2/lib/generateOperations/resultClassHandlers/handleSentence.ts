import { PncOperation } from "@moj-bichard7/common/types/PncOperation"

import type { ResultClassHandler } from "./ResultClassHandler"

import areAllPoliceDisposalsWithType from "../../areAllPoliceDisposalsWithType"
import areAnyPncDisposalsWithType from "../../areAnyPncDisposalsWithType"
import createOperation from "../createOperation"

export const handleSentence: ResultClassHandler = ({ aho, offence, resubmitted, result }) => {
  const fixedPenalty = aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber
  const courtCaseReference = offence?.CourtCaseReferenceNumber || undefined
  const operationData = courtCaseReference ? { courtCaseReference } : undefined

  if (fixedPenalty) {
    return [createOperation(PncOperation.PENALTY_HEARING, operationData)]
  }

  if (!result.PNCAdjudicationExists) {
    return []
  }

  if (!areAnyPncDisposalsWithType(aho, offence, 2007)) {
    return [createOperation(PncOperation.SENTENCE_DEFERRED, operationData)]
  }

  if (resubmitted || areAllPoliceDisposalsWithType(aho, offence, 2007)) {
    return [createOperation(PncOperation.DISPOSAL_UPDATED, operationData)]
  }

  return []
}
