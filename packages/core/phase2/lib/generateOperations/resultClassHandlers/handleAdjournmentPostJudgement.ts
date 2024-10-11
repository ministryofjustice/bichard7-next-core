import createRemandOperation from "../createRemandOperation"
import type { ResultClassHandler } from "./ResultClassHandler"

export const handleAdjournmentPostJudgement: ResultClassHandler = ({ offence, result }) =>
  result.PNCAdjudicationExists ? [createRemandOperation(result, offence?.CourtCaseReferenceNumber)] : []
