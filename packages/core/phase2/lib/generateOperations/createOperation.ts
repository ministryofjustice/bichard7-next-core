import type { Operation } from "../../../types/PncUpdateDataset"

const createOperation = <T extends Operation["code"], K extends Operation<T>>(
  operationCode: T,
  operationData: K["data"] | undefined
) =>
  ({
    code: operationCode,
    status: "NotAttempted",
    data: operationData
  }) as K

export default createOperation
