import { isEqual } from "lodash"
import type { Operation, OperationData } from "../../types/PncUpdateDataset"

const addNewOperationToOperationSetIfNotPresent = <T extends Operation["code"]>(
  operationCode: T,
  operationData: OperationData<T> | undefined,
  operations: Operation[]
) => {
  const newOperation = {
    code: operationCode,
    status: "NotAttempted",
    data: operationData
  } as Operation

  const duplicateOperation = operations.find((operation) => isEqual(operation, newOperation))

  if (!duplicateOperation) {
    operations.push(newOperation)
  }
}

export default addNewOperationToOperationSetIfNotPresent
