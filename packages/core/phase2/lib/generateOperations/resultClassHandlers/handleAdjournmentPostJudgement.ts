import createRemandOperation from "../createRemandOperation"
import type { ResultClassHandler } from "./ResultClassHandler"

export const handleAdjournmentPostJudgement: ResultClassHandler = ({ offence, result }) => {
  const operations = result.PNCAdjudicationExists
    ? [createRemandOperation(result, offence?.CourtCaseReferenceNumber)]
    : []

  return { operations, exceptions: [] }
}
