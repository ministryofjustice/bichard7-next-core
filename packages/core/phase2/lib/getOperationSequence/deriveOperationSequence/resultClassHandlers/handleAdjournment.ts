import addRemandOperation from "../../../addRemandOperation"
import type { ResultClassHandler } from "../deriveOperationSequence"

export const handleAdjournment: ResultClassHandler = ({ result, operations, ccrId, remandCcrs }) => {
  addRemandOperation(result, operations)
  if (ccrId) {
    remandCcrs.add(ccrId)
  }
}
