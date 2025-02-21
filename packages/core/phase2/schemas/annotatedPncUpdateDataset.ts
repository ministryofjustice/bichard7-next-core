import { z } from "zod"

import pncUpdateDatasetSchema from "../../schemas/pncUpdateDataset"

export const annotatedPNCUpdateDatasetSchema = z.object({
  AnnotatedPNCUpdateDataset: z.object({
    PNCUpdateDataset: pncUpdateDatasetSchema
  })
})
