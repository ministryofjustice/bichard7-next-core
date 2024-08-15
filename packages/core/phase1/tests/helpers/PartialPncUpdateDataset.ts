import type { z } from "zod"
import pncUpdateDatasetSchema from "../../../phase2/schemas/pncUpdateDataset"

const partialPncUpdateDataset = pncUpdateDatasetSchema.deepPartial()
export type PartialPncUpdateDataset = z.infer<typeof partialPncUpdateDataset>
