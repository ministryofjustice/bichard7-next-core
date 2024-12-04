import type { ResultClassHandler } from "./ResultClassHandler"

import createRemandOperation from "../createRemandOperation"

export const handleAdjournmentPostJudgement: ResultClassHandler = ({ offence, result }) =>
  result.PNCAdjudicationExists ? [createRemandOperation(result, offence?.CourtCaseReferenceNumber)] : []
