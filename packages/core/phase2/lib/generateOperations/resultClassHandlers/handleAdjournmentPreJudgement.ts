import createRemandOperation from "../createRemandOperation"
import type { ResultClassHandler } from "./ResultClassHandler"

export const handleAdjournmentPreJudgement: ResultClassHandler = ({ result, offence }) => {
  const operations = !result.PNCAdjudicationExists
    ? [createRemandOperation(result, offence?.CourtCaseReferenceNumber)]
    : []

  return { operations, exceptions: [] }
}
