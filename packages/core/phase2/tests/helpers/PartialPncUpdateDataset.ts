import type pncUpdateDatasetSchema from "@moj-bichard7/common/schemas/pncUpdateDataset"
import type { z } from "zod"

export type PartialPncUpdateDataset = DeepPartial<PncUpdateDataset>

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

type PncUpdateDataset = z.output<typeof pncUpdateDatasetSchema>
