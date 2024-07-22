import addRemandOperation from "../../../addRemandOperation"
import type { ResultClassHandler } from "../deriveOperationSequence"

export const handleAdjournment: ResultClassHandler = ({ result, operations, offence, remandCcrs }) => {
  addRemandOperation(result, operations)

  if (offence?.CourtCaseReferenceNumber) {
    remandCcrs.add(offence.CourtCaseReferenceNumber)
  }
}
