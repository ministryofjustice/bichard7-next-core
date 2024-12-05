import type { ResultClassHandler } from "./ResultClassHandler"

import createRemandOperation from "../createRemandOperation"

export const handleAdjournment: ResultClassHandler = ({ result, offence }) => [
  createRemandOperation(result, offence?.CourtCaseReferenceNumber)
]
