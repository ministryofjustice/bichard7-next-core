import createRemandOperation from "../createRemandOperation"
import type { ResultClassHandler } from "./ResultClassHandler"

export const handleAdjournmentPostJudgement: ResultClassHandler = ({ offence, result }) => {
  if (result.PNCAdjudicationExists) {
    return createRemandOperation(result, offence?.CourtCaseReferenceNumber)
  }

  return { operations: [], exceptions: [] }
}
