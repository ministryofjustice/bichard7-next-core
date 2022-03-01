import { TriggerCode } from "src/types/TriggerCode"
import type TriggerConfig from "src/types/TriggerConfig"
import type { TriggerGenerator } from "src/types/TriggerGenerator"
import TriggerRecordable from "src/types/TriggerRecordable"
import generateTriggersFromResultCode from "./generateTriggersFromResultCode"

const config: TriggerConfig = {
  triggerCode: TriggerCode.TRPR0017,
  resultCodesForTrigger: [2007],
  caseLevelTrigger: false,
  triggerRecordable: TriggerRecordable.Yes
}

const generator: TriggerGenerator = (courtResult, recordable) =>
  generateTriggersFromResultCode(courtResult, config, recordable)

export default generator
