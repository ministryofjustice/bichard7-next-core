import { TriggerCode } from "../types/TriggerCode"
import type TriggerConfig from "../types/TriggerConfig"
import type { TriggerGenerator } from "../types/TriggerGenerator"
import TriggerRecordable from "../types/TriggerRecordable"
import generateTriggersFromResultCode from "./generateTriggersFromResultCode"

const config: TriggerConfig = {
  triggerCode: TriggerCode.TRPR0021,
  resultCodesForTrigger: [3002, 3022, 3023, 3025, 3035, 3115],
  caseLevelTrigger: false,
  triggerRecordable: TriggerRecordable.Both
}

const generator: TriggerGenerator = (hearingOutcome, recordable) =>
  generateTriggersFromResultCode(hearingOutcome, config, recordable)

export default generator
