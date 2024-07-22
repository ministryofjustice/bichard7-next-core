import addRemandOperation from "../../../addRemandOperation"
import type { ResultClassHandler } from "../deriveOperationSequence"
import { handleJudgementWithFinalResult } from "./handleJudgementWithFinalResult"

export const handleAdjournmentWithJudgement: ResultClassHandler = (params) => {
  const { result, offence, operations, remandCcrs } = params
  const exception = handleJudgementWithFinalResult(params)

  addRemandOperation(result, operations)

  if (offence?.CourtCaseReferenceNumber) {
    remandCcrs.add(offence.CourtCaseReferenceNumber)
  }

  return exception
}
