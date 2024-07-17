import type { NewremOperation, Operation, PncUpdateDataset } from "../../types/PncUpdateDataset"
import areNewremTypesEqual from "./areNewremTypesEqual"

const refreshOperationSequence = (pncUpdateDataset: PncUpdateDataset, operations: Operation[]) => {
  // const latestOperations = getOperationSequence(pncUpdateDataset, true)
  let latestNewremOperations = operations.filter((operation) => operation.code === "NEWREM")

  if (pncUpdateDataset.PncOperations.length === 0) {
    pncUpdateDataset.PncOperations = operations
    return
  }

  pncUpdateDataset.PncOperations = pncUpdateDataset.PncOperations.filter(
    ({ code, status }) => code !== "NEWREM" || status === "Completed"
  )

  latestNewremOperations = latestNewremOperations.filter(
    (newOperation) =>
      !pncUpdateDataset.PncOperations.filter(({ code }) => code === "NEWREM").some((existingOperation) =>
        areNewremTypesEqual(existingOperation as NewremOperation, newOperation)
      )
  )

  pncUpdateDataset.PncOperations = [...pncUpdateDataset.PncOperations, ...latestNewremOperations].filter((o) => o)
}

export default refreshOperationSequence
