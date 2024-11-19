import type { z } from "zod"
import type pncUpdateDatasetSchema from "../phase2/schemas/pncUpdateDataset"
import type { operationSchema, operationStatusSchema } from "../phase2/schemas/pncUpdateDataset"
import type { AnnotatedHearingOutcome } from "./AnnotatedHearingOutcome"

const isPncUpdateDataset = (aho: AnnotatedHearingOutcome): aho is PncUpdateDataset => {
  return "PncOperations" in aho
}

type AnyOperation = z.infer<typeof operationSchema>
export type Operation<T = void | AnyOperation["code"]> = T extends void
  ? AnyOperation
  : Extract<AnyOperation, { code: T }>
export type OperationData<T extends Operation["code"]> = Operation<T>["data"]
export type OperationStatus = z.infer<typeof operationStatusSchema>
export type PncUpdateDataset = z.infer<typeof pncUpdateDatasetSchema>
export { isPncUpdateDataset }
