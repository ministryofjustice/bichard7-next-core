import addRemandOperation from "../../../addRemandOperation"
import type { ResultClassHandler } from "../deriveOperationSequence"

export const handleAdjournment: ResultClassHandler = ({ result, operations, offence }) => {
  addRemandOperation(result, offence?.CourtCaseReferenceNumber, operations)
}
