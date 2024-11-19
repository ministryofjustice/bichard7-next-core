import type { ResultClassHandler } from "./ResultClassHandler"

import createRemandOperation from "../createRemandOperation"

export const handleAdjournment: ResultClassHandler = ({ offence, result }) => [
  createRemandOperation(result, offence?.CourtCaseReferenceNumber)
]
