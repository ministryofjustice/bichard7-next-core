import type { AnnotatedPNCUpdateDataset } from "../types/AnnotatedPNCUpdateDataset"

const putPncUpdateError = (pud: AnnotatedPNCUpdateDataset) => {
  console.log("pud has exceptions:", pud.AnnotatedPNCUpdateDataset.PNCUpdateDataset.Exceptions)
  console.log("Inserts or updates an error list record derived from the specified annotated PNC update dataset")
  console.log("To be implemented: ErrorListServiceImpl.java:440")
}

export default putPncUpdateError
