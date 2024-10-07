import createRemandOperation from "../createRemandOperation"
import type { ResultClassHandler } from "./ResultClassHandler"

export const handleAdjournment: ResultClassHandler = ({ result, offence }) => ({
  operations: [createRemandOperation(result, offence?.CourtCaseReferenceNumber)],
  exceptions: []
})
