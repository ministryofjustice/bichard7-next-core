import type { TriggerCode } from "core/common/types/TriggerCode"
import type TriggerRecordable from "./TriggerRecordable"

type TriggerConfig = {
  triggerCode: TriggerCode
  resultCodesForTrigger?: number[]
  resultCodeQualifier?: string
  triggerRecordable: TriggerRecordable
  caseLevelTrigger?: boolean
}

export default TriggerConfig
