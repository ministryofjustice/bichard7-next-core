import type { TriggerCode } from "../../types/TriggerCode"
import type TriggerRecordable from "../types/TriggerRecordable"

type TriggerConfig = {
  triggerCode: TriggerCode
  resultCodesForTrigger?: number[]
  resultCodeQualifier?: string
  triggerRecordable: TriggerRecordable
  caseLevelTrigger?: boolean
}

export default TriggerConfig
