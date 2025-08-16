import type { z } from "zod"

import type pncUpdateDatasetSchema from "../../../schemas/pncUpdateDataset"

export type PartialPncUpdateDataset = DeepPartial<PncUpdateDataset>

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

type PncUpdateDataset = z.output<typeof pncUpdateDatasetSchema>
