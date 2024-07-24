import type Exception from "../../../../types/Exception"
import type { Operation } from "../../../../types/PncUpdateDataset"

type ExceptionsAndOperations = {
  exceptions: Exception[]
  operations: Operation[]
}

export default ExceptionsAndOperations
