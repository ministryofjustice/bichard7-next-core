import type { Operation } from "../../../types/PncUpdateDataset"
import { PNCMessageType } from "../../../types/operationCodes"

const sortOperations = (operations: Operation[]): Operation[] =>
  operations
    .filter((o) => String(o.code) !== PNCMessageType.REMAND)
    .concat(operations.filter((o) => String(o.code) === PNCMessageType.REMAND))

export default sortOperations
