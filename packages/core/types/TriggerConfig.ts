import type TriggerCode from "@moj-bichard7/standing-data/types/TriggerCode"

import type TriggerRecordable from "../types/TriggerRecordable"

type TriggerConfig = {
  caseLevelTrigger?: boolean
  resultCodeQualifier?: string
  resultCodesForTrigger?: number[]
  triggerCode: TriggerCode
  triggerRecordable: TriggerRecordable
}

export default TriggerConfig
