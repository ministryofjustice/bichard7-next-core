import type * as z from "zod/v4"

import type { annotatedPncUpdateDatasetSchema } from "../schemas/annotatedPncUpdateDataset"

type AnnotatedPncUpdateDataset = z.infer<typeof annotatedPncUpdateDatasetSchema>

export default AnnotatedPncUpdateDataset
