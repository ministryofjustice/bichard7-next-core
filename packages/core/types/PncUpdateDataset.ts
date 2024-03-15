import type { z } from "zod"
import pncUpdateDatasetSchema, { operationSchema, operationStatusSchema } from "../phase2/schemas/pncUpdateDataset"

export type OperationStatus = z.infer<typeof operationStatusSchema>
export type Operation = z.infer<typeof operationSchema>
export type PncUpdateDataset = z.infer<typeof pncUpdateDatasetSchema>
