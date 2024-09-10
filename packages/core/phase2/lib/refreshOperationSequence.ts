import type { NewremOperation, Operation, PncUpdateDataset } from "../../types/PncUpdateDataset"
import { PNCMessageType } from "../../types/operationCodes"
import areNewremTypesEqual from "./areNewremTypesEqual"

const refreshOperationSequence = (pncUpdateDataset: PncUpdateDataset, operations: Operation[]) => {
  let latestNewremOperations = operations.filter((operation) => operation.code === PNCMessageType.REMAND)

  if (pncUpdateDataset.PncOperations.length === 0) {
    pncUpdateDataset.PncOperations = operations
    return
  }

  pncUpdateDataset.PncOperations = pncUpdateDataset.PncOperations.filter(
    ({ code, status }) => code !== PNCMessageType.REMAND || status === "Completed"
  )

  latestNewremOperations = latestNewremOperations.filter(
    (newOperation) =>
      !pncUpdateDataset.PncOperations.filter(({ code }) => code === PNCMessageType.REMAND).some((existingOperation) =>
        areNewremTypesEqual(existingOperation as NewremOperation, newOperation)
      )
  )

  pncUpdateDataset.PncOperations = [...pncUpdateDataset.PncOperations, ...latestNewremOperations].filter((o) => o)
}

export default refreshOperationSequence
