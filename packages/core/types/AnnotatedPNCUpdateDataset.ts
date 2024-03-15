import type { z } from "zod"
import type { annotatedPNCUpdateDatasetSchema } from "../phase1/schemas/annotatedPNCUpdateDataset"

export type AnnotatedPNCUpdateDataset = z.infer<typeof annotatedPNCUpdateDatasetSchema>
