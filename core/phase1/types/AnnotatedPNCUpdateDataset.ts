import type { annotatedPNCUpdateDatasetSchema } from "../schemas/annotatedPNCUpdateDataset"
import type { z } from "zod"

export type AnnotatedPNCUpdateDataset = z.infer<typeof annotatedPNCUpdateDatasetSchema>
