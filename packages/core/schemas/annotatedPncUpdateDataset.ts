import { z } from "zod"
import pncUpdateDatasetSchema from "../phase2/schemas/pncUpdateDataset"

export const annotatedPncUpdateDatasetSchema = z.object({
  AnnotatedPNCUpdateDataset: z.object({
    PNCUpdateDataset: pncUpdateDatasetSchema
  })
})
