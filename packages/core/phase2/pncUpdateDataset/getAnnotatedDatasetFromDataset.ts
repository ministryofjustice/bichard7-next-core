import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import type { AnnotatedPNCUpdateDataset } from "../../types/AnnotatedPNCUpdateDataset"

const getAnnotatedDatasetFromDataset = (pncUpdateDataset: PncUpdateDataset): AnnotatedPNCUpdateDataset => {
  return { AnnotatedPNCUpdateDataset: { PNCUpdateDataset: pncUpdateDataset } }
}

export default getAnnotatedDatasetFromDataset
