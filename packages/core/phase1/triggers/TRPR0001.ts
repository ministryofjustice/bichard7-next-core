import { TriggerCode } from "types/TriggerCode"
import type TriggerConfig from "phase1/types/TriggerConfig"
import type { TriggerGenerator } from "phase1/types/TriggerGenerator"
import TriggerRecordable from "phase1/types/TriggerRecordable"
import generateTriggersFromResultCode from "phase1/triggers/generateTriggersFromResultCode"

const config: TriggerConfig = {
  triggerCode: TriggerCode.TRPR0001,
  resultCodesForTrigger: [3007, 3028, 3030, 3050, 3051, 3070, 3071, 3072, 3073, 3074, 3094, 3095, 3096],
  caseLevelTrigger: false,
  triggerRecordable: TriggerRecordable.Both
}

const generator: TriggerGenerator = (hearingOutcome) => generateTriggersFromResultCode(hearingOutcome, config)

export default generator
