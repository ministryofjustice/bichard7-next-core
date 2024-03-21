import { z } from "zod"
import pncUpdateDatasetSchema from "./pncUpdateDataset"

export const annotatedPNCUpdateDatasetSchema = z.object({
  AnnotatedPNCUpdateDataset: z.object({
    PNCUpdateDataset: pncUpdateDatasetSchema
  })
})
