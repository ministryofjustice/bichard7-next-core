import type { z } from "zod"

import type pncUpdateDatasetSchema from "../schemas/pncUpdateDataset"
import type { operationSchema, operationStatusSchema } from "../schemas/pncUpdateDataset"
import type { AnnotatedHearingOutcome } from "./AnnotatedHearingOutcome"

const isPncUpdateDataset = (aho: AnnotatedHearingOutcome): aho is PncUpdateDataset => {
  return "PncOperations" in aho
}

export type Operation<T = AnyOperation["code"] | void> = T extends void
  ? AnyOperation
  : Extract<AnyOperation, { code: T }>
export type OperationData<T extends Operation["code"]> = Operation<T>["data"]
export type OperationStatus = z.infer<typeof operationStatusSchema>
export type PncUpdateDataset = z.infer<typeof pncUpdateDatasetSchema>
type AnyOperation = z.infer<typeof operationSchema>
export { isPncUpdateDataset }
