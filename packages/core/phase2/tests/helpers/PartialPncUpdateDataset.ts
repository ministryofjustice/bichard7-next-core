import type { z } from "zod"

import pncUpdateDatasetSchema from "../../../schemas/pncUpdateDataset"

const _partialPncUpdateDataset = pncUpdateDatasetSchema.deepPartial()
export type PartialPncUpdateDataset = z.infer<typeof _partialPncUpdateDataset>
