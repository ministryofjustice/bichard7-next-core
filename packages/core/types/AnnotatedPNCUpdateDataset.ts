import type { z } from "zod"
import type { annotatedPNCUpdateDatasetSchema } from "../phase2/schemas/annotatedPNCUpdateDataset"

type AnnotatedPncUpdateDataset = z.infer<typeof annotatedPNCUpdateDatasetSchema>

export default AnnotatedPncUpdateDataset
