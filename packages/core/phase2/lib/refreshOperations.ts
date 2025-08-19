import type { Operation, PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import { PncOperation } from "@moj-bichard7/common/types/PncOperation"

import areRemandOperationsEqual from "./areRemandOperationsEqual"

const isDuplicateOperation = (existingOperations: Operation[], newRemandOperation: Operation<PncOperation.REMAND>) =>
  existingOperations.some(
    (existingOperation) =>
      existingOperation.code === PncOperation.REMAND && areRemandOperationsEqual(existingOperation, newRemandOperation)
  )

const excludeIncompleteRemandOperation = (operation: Operation) =>
  operation.code !== PncOperation.REMAND || operation.status === "Completed"

const refreshOperations = (pncUpdateDataset: PncUpdateDataset, newOperations: Operation[]): Operation[] => {
  if (pncUpdateDataset.PncOperations.length === 0) {
    return newOperations
  }

  const existingOperations = pncUpdateDataset.PncOperations.filter(excludeIncompleteRemandOperation)
  const newRemandOperations = newOperations.filter(
    (newOperation) =>
      newOperation.code === PncOperation.REMAND && !isDuplicateOperation(existingOperations, newOperation)
  )

  return existingOperations.concat(newRemandOperations)
}

export default refreshOperations
