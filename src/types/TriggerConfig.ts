import type { TriggerCode } from "./TriggerCode"
import type TriggerRecordable from "./TriggerRecordable"

type TriggerConfig = {
  triggerCode: TriggerCode
  resultCodesForTrigger: number[]
  triggerRecordable: TriggerRecordable
  caseLevelTrigger?: boolean
}

export default TriggerConfig
