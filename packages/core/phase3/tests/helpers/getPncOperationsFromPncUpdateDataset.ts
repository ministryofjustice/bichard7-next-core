import type AnnotatedPncUpdateDataset from "../../../types/AnnotatedPncUpdateDataset"
import type { Operation, PncUpdateDataset } from "../../../types/PncUpdateDataset"

const getPncOperationsFromPncUpdateDataset = (message: AnnotatedPncUpdateDataset | PncUpdateDataset): Operation[] => {
  if ("PncOperations" in message) {
    return message.PncOperations
  }

  return message.AnnotatedPNCUpdateDataset.PNCUpdateDataset.PncOperations
}

export default getPncOperationsFromPncUpdateDataset
