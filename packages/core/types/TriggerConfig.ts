import type TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import type TriggerRecordable from "../types/TriggerRecordable"

type TriggerConfig = {
  triggerCode: TriggerCode
  resultCodesForTrigger?: number[]
  resultCodeQualifier?: string
  triggerRecordable: TriggerRecordable
  caseLevelTrigger?: boolean
}

export default TriggerConfig
