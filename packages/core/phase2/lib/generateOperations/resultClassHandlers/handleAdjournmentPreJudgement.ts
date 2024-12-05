import type { ResultClassHandler } from "./ResultClassHandler"

import createRemandOperation from "../createRemandOperation"

export const handleAdjournmentPreJudgement: ResultClassHandler = ({ result, offence }) =>
  !result.PNCAdjudicationExists ? [createRemandOperation(result, offence?.CourtCaseReferenceNumber)] : []
