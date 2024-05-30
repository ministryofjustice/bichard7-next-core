import type { AnnotatedPNCUpdateDataset } from "../../types/AnnotatedPNCUpdateDataset"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"

const getAnnotatedDatasetFromDataset = (pncUpdateDataset: PncUpdateDataset): AnnotatedPNCUpdateDataset => {
  return {
    AnnotatedPNCUpdateDataset: {
      PNCUpdateDataset: pncUpdateDataset
    }
  }
}

export default getAnnotatedDatasetFromDataset
