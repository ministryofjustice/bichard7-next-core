import type AnnotatedPncUpdateDataset from "@moj-bichard7/common/types/AnnotatedPncUpdateDataset"
import type { Operation, PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

const getPncOperationsFromPncUpdateDataset = (message: AnnotatedPncUpdateDataset | PncUpdateDataset): Operation[] => {
  if ("PncOperations" in message) {
    return message.PncOperations
  }

  return message.AnnotatedPNCUpdateDataset.PNCUpdateDataset.PncOperations
}

export default getPncOperationsFromPncUpdateDataset
