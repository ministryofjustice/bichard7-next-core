import { z } from "zod"

import pncUpdateDatasetSchema from "./pncUpdateDataset"

export const annotatedPncUpdateDatasetSchema = z.object({
  AnnotatedPNCUpdateDataset: z.object({
    PNCUpdateDataset: pncUpdateDatasetSchema
  })
})
