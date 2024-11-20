import isEqual from "lodash.isequal"

import type { Operation } from "../../../types/PncUpdateDataset"

const deduplicateOperations = (operations: Operation[]): Operation[] =>
  operations.reduce((deduplicatedOperations: Operation[], operation) => {
    const isDuplicate = deduplicatedOperations.some(
      (op) => op.code === operation.code && op.status === operation.status && isEqual(op.data, operation.data)
    )

    if (!isDuplicate) {
      deduplicatedOperations.push(operation)
    }

    return deduplicatedOperations
  }, [])

export default deduplicateOperations
