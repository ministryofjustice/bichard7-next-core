import type { ResultClassHandler } from "./ResultClassHandler"

import createRemandOperation from "../createRemandOperation"
import { handleJudgementWithFinalResult } from "./handleJudgementWithFinalResult"

export const handleAdjournmentWithJudgement: ResultClassHandler = (params) =>
  handleJudgementWithFinalResult(params).concat(
    createRemandOperation(params.result, params.offence?.CourtCaseReferenceNumber)
  )
