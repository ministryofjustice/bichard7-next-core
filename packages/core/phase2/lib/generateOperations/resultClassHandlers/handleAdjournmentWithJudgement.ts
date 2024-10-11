import createRemandOperation from "../createRemandOperation"
import type { ResultClassHandler } from "./ResultClassHandler"
import { handleJudgementWithFinalResult } from "./handleJudgementWithFinalResult"

export const handleAdjournmentWithJudgement: ResultClassHandler = (params) =>
  handleJudgementWithFinalResult(params).concat(
    createRemandOperation(params.result, params.offence?.CourtCaseReferenceNumber)
  )
