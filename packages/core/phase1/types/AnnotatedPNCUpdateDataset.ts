import type { z } from "zod"
import type { annotatedPNCUpdateDatasetSchema } from "../schemas/annotatedPNCUpdateDataset"

export type AnnotatedPNCUpdateDataset = z.infer<typeof annotatedPNCUpdateDatasetSchema>
