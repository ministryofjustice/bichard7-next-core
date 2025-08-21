import type { Operation } from "@moj-bichard7/common/types/PncUpdateDataset"

import { PncOperation } from "@moj-bichard7/common/types/PncOperation"

const sortOperations = (operations: Operation[]): Operation[] =>
  operations
    .filter((o) => String(o.code) !== PncOperation.REMAND)
    .concat(operations.filter((o) => String(o.code) === PncOperation.REMAND))

export default sortOperations
