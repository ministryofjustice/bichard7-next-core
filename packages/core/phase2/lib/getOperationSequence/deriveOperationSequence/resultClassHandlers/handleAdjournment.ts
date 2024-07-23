import createRemandOperation from "../../../createRemandOperation"
import type { ResultClassHandler } from "../deriveOperationSequence"

export const handleAdjournment: ResultClassHandler = ({ result, offence }) =>
  createRemandOperation(result, offence?.CourtCaseReferenceNumber)
