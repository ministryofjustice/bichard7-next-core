import type EventCode from "@moj-bichard7/common/types/EventCode"

import type { Operation } from "../../types/PncUpdateDataset"

type OperationsAndEvents = {
  events?: EventCode[]
  operations: Operation[]
}

export default OperationsAndEvents
