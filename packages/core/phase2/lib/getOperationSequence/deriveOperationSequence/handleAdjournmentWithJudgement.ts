import addRemandOperation from "../../addRemandOperation"
import type { ResultClassHandler } from "./deriveOperationSequence"
import { handleJudgementWithFinalResult } from "./handleJudgementWithFinalResult"

export const handleAdjournmentWithJudgement: ResultClassHandler = (params) => {
  const { result, ccrId, operations, remandCcrs } = params
  const exception = handleJudgementWithFinalResult(params)
  addRemandOperation(result, operations)

  if (ccrId) {
    remandCcrs.add(ccrId)
  }

  return exception
}
