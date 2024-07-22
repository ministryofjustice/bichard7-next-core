import type { Operation, OperationData } from "../../types/PncUpdateDataset"

const addNewOperationToOperationSetIfNotPresent = <T extends Operation["code"]>(
  operationCode: T,
  operationData: OperationData<T> | undefined,
  operations: Operation[]
) => {
  operations.push({
    code: operationCode,
    status: "NotAttempted",
    data: operationData
  } as Operation)
}

export default addNewOperationToOperationSetIfNotPresent
