import type { z } from "zod"
import type pncUpdateDatasetSchema from "../phase2/schemas/pncUpdateDataset"
import type { newremOperationSchema, operationSchema, operationStatusSchema } from "../phase2/schemas/pncUpdateDataset"
import { AnnotatedHearingOutcome } from "./AnnotatedHearingOutcome"

const isPncUpdateDataset = (aho: AnnotatedHearingOutcome): aho is PncUpdateDataset => {
  return "PncOperations" in aho
}

export type OperationStatus = z.infer<typeof operationStatusSchema>
export type Operation = z.infer<typeof operationSchema>
export type NewremOperation = z.infer<typeof newremOperationSchema>
export type OperationData<T extends Operation["code"]> = Extract<Operation, { code: T }>["data"]
export type PncUpdateDataset = z.infer<typeof pncUpdateDatasetSchema>
export { isPncUpdateDataset }
