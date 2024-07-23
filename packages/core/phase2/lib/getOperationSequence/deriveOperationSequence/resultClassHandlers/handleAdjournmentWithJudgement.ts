import addRemandOperation from "../../../addRemandOperation"
import type { ResultClassHandler } from "../deriveOperationSequence"
import { handleJudgementWithFinalResult } from "./handleJudgementWithFinalResult"

export const handleAdjournmentWithJudgement: ResultClassHandler = (params) => {
  const { result, offence, operations } = params
  const exception = handleJudgementWithFinalResult(params)

  addRemandOperation(result, offence?.CourtCaseReferenceNumber, operations)

  return exception
}
