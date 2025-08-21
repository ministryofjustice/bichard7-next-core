import type { Operation } from "@moj-bichard7/common/types/PncUpdateDataset"

import isEqual from "lodash.isequal"

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
