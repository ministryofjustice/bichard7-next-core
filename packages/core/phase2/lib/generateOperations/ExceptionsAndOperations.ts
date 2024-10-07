import type EventCode from "@moj-bichard7/common/types/EventCode"
import type Exception from "../../../types/Exception"
import type { Operation } from "../../../types/PncUpdateDataset"

type ExceptionsAndOperations = {
  exceptions: Exception[]
  operations: Operation[]
  events?: EventCode[]
}

export default ExceptionsAndOperations
