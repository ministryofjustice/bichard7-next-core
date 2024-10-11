import createRemandOperation from "../createRemandOperation"
import type { ResultClassHandler } from "./ResultClassHandler"

export const handleAdjournmentPreJudgement: ResultClassHandler = ({ result, offence }) =>
  !result.PNCAdjudicationExists ? [createRemandOperation(result, offence?.CourtCaseReferenceNumber)] : []
