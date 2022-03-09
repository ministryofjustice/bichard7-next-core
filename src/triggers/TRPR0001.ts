import { TriggerCode } from "src/types/TriggerCode"
import type TriggerConfig from "src/types/TriggerConfig"
import type { TriggerGenerator } from "src/types/TriggerGenerator"
import TriggerRecordable from "src/types/TriggerRecordable"
import generateTriggersFromResultCode from "./generateTriggersFromResultCode"

const config: TriggerConfig = {
  triggerCode: TriggerCode.TRPR0001,
  resultCodesForTrigger: [3007, 3028, 3030, 3050, 3051, 3070, 3071, 3072, 3073, 3074, 3094, 3095, 3096],
  caseLevelTrigger: false,
  triggerRecordable: TriggerRecordable.Both
}

const generator: TriggerGenerator = {
  independent: true,
  generate: (hearingOutcome, recordable) => generateTriggersFromResultCode(hearingOutcome, config, recordable)
}

export default generator
