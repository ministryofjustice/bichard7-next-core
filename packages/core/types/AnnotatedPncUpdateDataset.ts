import type { z } from "zod"
import type { annotatedPncUpdateDatasetSchema } from "../schemas/annotatedPncUpdateDataset"

type AnnotatedPncUpdateDataset = z.infer<typeof annotatedPncUpdateDatasetSchema>

export default AnnotatedPncUpdateDataset
