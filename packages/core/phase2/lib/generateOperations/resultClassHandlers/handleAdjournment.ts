import createRemandOperation from "../createRemandOperation"
import type { ResultClassHandler } from "./ResultClassHandler"

export const handleAdjournment: ResultClassHandler = ({ result, offence }) => [
  createRemandOperation(result, offence?.CourtCaseReferenceNumber)
]
