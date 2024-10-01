import createRemandOperation from "../createRemandOperation"
import type { ResultClassHandler } from "./ResultClassHandler"

export const handleAdjournmentPreJudgement: ResultClassHandler = ({ result, offence }) => {
  if (result.PNCAdjudicationExists) {
    return { operations: [], exceptions: [] }
  }

  return createRemandOperation(result, offence?.CourtCaseReferenceNumber)
}
