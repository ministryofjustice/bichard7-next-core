import * as z from "zod/v4"

import pncUpdateDatasetSchema from "./pncUpdateDataset"

export const annotatedPncUpdateDatasetSchema = z.object({
  AnnotatedPNCUpdateDataset: z.object({
    PNCUpdateDataset: pncUpdateDatasetSchema
  })
})
