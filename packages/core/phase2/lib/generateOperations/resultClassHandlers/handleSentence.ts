import type { ResultClassHandler } from "./ResultClassHandler"

import { PncOperation } from "../../../../types/PncOperation"
import areAllPncDisposalsWithType from "../../areAllPncDisposalsWithType"
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

  if (resubmitted || areAllPncDisposalsWithType(aho, offence, 2007)) {
    return [createOperation(PncOperation.DISPOSAL_UPDATED, operationData)]
  }

  return []
}
