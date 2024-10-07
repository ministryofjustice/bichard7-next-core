import areAnyPncResults2007 from "../areAnyPncResults2007"
import createOperation from "../createOperation"
import type { ResultClassHandler } from "./ResultClassHandler"
import { PncOperation } from "../../../../types/PncOperation"
import areAllPncResults2007 from "../../areAllPncResults2007"

export const handleSentence: ResultClassHandler = ({ aho, offence, resubmitted, result }) => {
  const fixedPenalty = aho.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber
  const ccrId = offence?.CourtCaseReferenceNumber || undefined
  const operationData = ccrId ? { courtCaseReference: ccrId } : undefined

  if (fixedPenalty) {
    return { operations: [createOperation(PncOperation.PENALTY_HEARING, operationData)], exceptions: [] }
  }

  if (!result.PNCAdjudicationExists) {
    return { operations: [], exceptions: [] }
  }

  if (!areAnyPncResults2007(aho, offence)) {
    return { operations: [createOperation(PncOperation.SENTENCE_DEFERRED, operationData)], exceptions: [] }
  }

  if (resubmitted || areAllPncResults2007(aho, operationData?.courtCaseReference)) {
    return { operations: [createOperation(PncOperation.DISPOSAL_UPDATED, operationData)], exceptions: [] }
  }

  return { operations: [], exceptions: [] }
}
