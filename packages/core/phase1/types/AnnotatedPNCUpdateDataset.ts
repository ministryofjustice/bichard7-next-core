import type { annotatedPNCUpdateDatasetSchema } from "phase1/schemas/annotatedPNCUpdateDataset"
import type { z } from "zod"

export type AnnotatedPNCUpdateDataset = z.infer<typeof annotatedPNCUpdateDatasetSchema>
