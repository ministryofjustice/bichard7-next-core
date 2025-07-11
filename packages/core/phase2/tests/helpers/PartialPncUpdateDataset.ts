import type { z } from "zod"

import type pncUpdateDatasetSchema from "../../../schemas/pncUpdateDataset"

export type PartialPncUpdateDataset = DeepPartial<z.infer<typeof pncUpdateDatasetSchema>>

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
