import type { z } from "zod"
import pncUpdateDatasetSchema from "../schemas/pncUpdateDataset"

export type PncUpdateDataset = z.infer<typeof pncUpdateDatasetSchema>
