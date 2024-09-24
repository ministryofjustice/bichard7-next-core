import isEqual from "lodash.isequal"
import type { Operation } from "../../../types/PncUpdateDataset"

const deduplicateOperations = (operations: Operation[]): Operation[] =>
  operations.reduce((acc: Operation[], operation) => {
    const isDuplicate = acc.some(
      (op) => op.code === operation.code && op.status === operation.status && isEqual(op.data, operation.data)
    )

    if (!isDuplicate) {
      acc.push(operation)
    }

    return acc
  }, [])

export default deduplicateOperations
