import createRemandOperation from "../createRemandOperation"
import { ResultClassHandler } from "./ResultClassHandler"
import { handleJudgementWithFinalResult } from "./handleJudgementWithFinalResult"

export const handleAdjournmentWithJudgement: ResultClassHandler = (params) => {
  const { result, offence } = params
  const handlerResult = handleJudgementWithFinalResult(params)
  const remandOperationResult = createRemandOperation(result, offence?.CourtCaseReferenceNumber)

  return {
    operations: [...handlerResult.operations, ...remandOperationResult.operations],
    exceptions: [...handlerResult.exceptions, ...remandOperationResult.exceptions]
  }
}
