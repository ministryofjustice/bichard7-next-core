import { TriggerCode } from "types/TriggerCode"
import type TriggerConfig from "phase1/types/TriggerConfig"
import type { TriggerGenerator } from "phase1/types/TriggerGenerator"
import TriggerRecordable from "phase1/types/TriggerRecordable"
import generateTriggersFromResultCode from "phase1/triggers/generateTriggersFromResultCode"

const config: TriggerConfig = {
  triggerCode: TriggerCode.TRPR0021,
  resultCodesForTrigger: [3002, 3022, 3023, 3025, 3035, 3115],
  caseLevelTrigger: false,
  triggerRecordable: TriggerRecordable.Both
}

const generator: TriggerGenerator = (hearingOutcome) => generateTriggersFromResultCode(hearingOutcome, config)

export default generator
