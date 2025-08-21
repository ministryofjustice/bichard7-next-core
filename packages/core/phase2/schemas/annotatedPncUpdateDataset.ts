import pncUpdateDatasetSchema from "@moj-bichard7/common/schemas/pncUpdateDataset"
import { z } from "zod"

export const annotatedPNCUpdateDatasetSchema = z.object({
  AnnotatedPNCUpdateDataset: z.object({
    PNCUpdateDataset: pncUpdateDatasetSchema
  })
})
