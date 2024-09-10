import type { Operation } from "../../../types/PncUpdateDataset"
import { PncOperation } from "../../../types/PncOperation"

const sortOperations = (operations: Operation[]): Operation[] =>
  operations
    .filter((o) => String(o.code) !== PncOperation.REMAND)
    .concat(operations.filter((o) => String(o.code) === PncOperation.REMAND))

export default sortOperations
