import { TriggerCode } from "../types/TriggerCode"
import type TriggerConfig from "../types/TriggerConfig"
import type { TriggerGenerator } from "../types/TriggerGenerator"
import TriggerRecordable from "../types/TriggerRecordable"
import generateTriggersFromResultCode from "./generateTriggersFromResultCode"

const config: TriggerConfig = {
  triggerCode: TriggerCode.TRPR0017,
  resultCodesForTrigger: [2007],
  caseLevelTrigger: false,
  triggerRecordable: TriggerRecordable.Yes
}

const generator: TriggerGenerator = {
  independent: true,
  generate: (courtResult, recordable) => generateTriggersFromResultCode(courtResult, config, recordable)
}

export default generator
