import type { Operation, OperationData } from "../../types/PncUpdateDataset"

const createOperation = <T extends Operation["code"]>(operationCode: T, operationData: OperationData<T> | undefined) =>
  ({
    code: operationCode,
    status: "NotAttempted",
    data: operationData
  }) as Operation

export default createOperation
