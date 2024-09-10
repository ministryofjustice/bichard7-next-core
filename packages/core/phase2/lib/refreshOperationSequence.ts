import type { NewremOperation, Operation, PncUpdateDataset } from "../../types/PncUpdateDataset"
import { PncOperation } from "../../types/PncOperation"
import areNewremTypesEqual from "./areNewremTypesEqual"

const refreshOperationSequence = (pncUpdateDataset: PncUpdateDataset, operations: Operation[]) => {
  let latestNewremOperations = operations.filter((operation) => operation.code === PncOperation.REMAND)

  if (pncUpdateDataset.PncOperations.length === 0) {
    pncUpdateDataset.PncOperations = operations
    return
  }

  pncUpdateDataset.PncOperations = pncUpdateDataset.PncOperations.filter(
    ({ code, status }) => code !== PncOperation.REMAND || status === "Completed"
  )

  latestNewremOperations = latestNewremOperations.filter(
    (newOperation) =>
      !pncUpdateDataset.PncOperations.filter(({ code }) => code === PncOperation.REMAND).some((existingOperation) =>
        areNewremTypesEqual(existingOperation as NewremOperation, newOperation)
      )
  )

  pncUpdateDataset.PncOperations = [...pncUpdateDataset.PncOperations, ...latestNewremOperations].filter((o) => o)
}

export default refreshOperationSequence
