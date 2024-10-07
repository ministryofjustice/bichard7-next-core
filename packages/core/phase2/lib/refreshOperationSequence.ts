import { PncOperation } from "../../types/PncOperation"
import type { RemandOperation, Operation, PncUpdateDataset } from "../../types/PncUpdateDataset"
import areRemandOperationsEqual from "./areRemandOperationsEqual"

const refreshOperationSequence = (pncUpdateDataset: PncUpdateDataset, operations: Operation[]) => {
  let latestRemandOperations = operations.filter((operation) => operation.code === PncOperation.REMAND)

  if (pncUpdateDataset.PncOperations.length === 0) {
    pncUpdateDataset.PncOperations = operations
    return
  }

  pncUpdateDataset.PncOperations = pncUpdateDataset.PncOperations.filter(
    ({ code, status }) => code !== PncOperation.REMAND || status === "Completed"
  )

  latestRemandOperations = latestRemandOperations.filter(
    (newOperation) =>
      !pncUpdateDataset.PncOperations.filter(({ code }) => code === PncOperation.REMAND).some((existingOperation) =>
        areRemandOperationsEqual(existingOperation as RemandOperation, newOperation as RemandOperation)
      )
  )

  pncUpdateDataset.PncOperations = [...pncUpdateDataset.PncOperations, ...latestRemandOperations].filter((o) => o)
}

export default refreshOperationSequence
