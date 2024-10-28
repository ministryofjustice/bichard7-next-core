import areAnyPncResults2007 from "../../areAnyPncResults2007"
import createOperation from "../createOperation"
import type { ResultClassHandler } from "./ResultClassHandler"
import { PncOperation } from "../../../../types/PncOperation"
import areAllPncDisposalsWithType from "../../areAllPncDisposalsWithType"

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

  if (!areAnyPncResults2007(aho, offence)) {
    return [createOperation(PncOperation.SENTENCE_DEFERRED, operationData)]
  }

  if (resubmitted || areAllPncDisposalsWithType(aho, offence, 2007)) {
    return [createOperation(PncOperation.DISPOSAL_UPDATED, operationData)]
  }

  return []
}
