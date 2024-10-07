import createRemandOperation from "../createRemandOperation"
import type { ResultClassHandler } from "./ResultClassHandler"
import { handleJudgementWithFinalResult } from "./handleJudgementWithFinalResult"

export const handleAdjournmentWithJudgement: ResultClassHandler = (params) => {
  const { result, offence } = params
  const { operations, exceptions } = handleJudgementWithFinalResult(params)
  operations.push(createRemandOperation(result, offence?.CourtCaseReferenceNumber))

  return { operations, exceptions }
}
