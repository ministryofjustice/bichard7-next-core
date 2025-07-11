import * as z from "zod/v4"

import pncUpdateDatasetSchema from "../../schemas/pncUpdateDataset"

export const annotatedPNCUpdateDatasetSchema = z.object({
  AnnotatedPNCUpdateDataset: z.object({
    PNCUpdateDataset: pncUpdateDatasetSchema
  })
})
