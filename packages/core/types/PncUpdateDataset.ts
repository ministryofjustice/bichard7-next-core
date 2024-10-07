import type { z } from "zod"
import type pncUpdateDatasetSchema from "../phase2/schemas/pncUpdateDataset"
import type { operationSchema, operationStatusSchema } from "../phase2/schemas/pncUpdateDataset"
import type { AnnotatedHearingOutcome } from "./AnnotatedHearingOutcome"
import type { PncOperation } from "./PncOperation"

const isPncUpdateDataset = (aho: AnnotatedHearingOutcome): aho is PncUpdateDataset => {
  return "PncOperations" in aho
}

export type OperationStatus = z.infer<typeof operationStatusSchema>
export type Operation = z.infer<typeof operationSchema>
export type RemandOperation = Extract<Operation, { code: PncOperation.REMAND }>
export type OperationData<T extends Operation["code"]> = Extract<Operation, { code: T }>["data"]
export type PncUpdateDataset = z.infer<typeof pncUpdateDatasetSchema>
export { isPncUpdateDataset }
