import type { Operation } from "../../../types/PncUpdateDataset"

const createOperation = <T extends Operation["code"], K extends Operation<T>>(
  operationCode: T,
  operationData: K["data"] | undefined
) =>
  ({
    code: operationCode,
    data: operationData,
    status: "NotAttempted"
  }) as K

export default createOperation
