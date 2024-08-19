import type { z } from "zod"
import pncUpdateDatasetSchema from "../../schemas/pncUpdateDataset"

const partialPncUpdateDataset = pncUpdateDatasetSchema.deepPartial()
export type PartialPncUpdateDataset = z.infer<typeof partialPncUpdateDataset>
