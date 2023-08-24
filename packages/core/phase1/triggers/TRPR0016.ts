import { TriggerCode } from "../../types/TriggerCode"
import generateTriggersFromResultCode from "../triggers/generateTriggersFromResultCode"
import type TriggerConfig from "../types/TriggerConfig"
import type { TriggerGenerator } from "../types/TriggerGenerator"
import TriggerRecordable from "../types/TriggerRecordable"

const config: TriggerConfig = {
  triggerCode: TriggerCode.TRPR0016,
  resultCodesForTrigger: [3055, 3056, 3134, 3135, 3136, 3137, 3138],
  caseLevelTrigger: false,
  triggerRecordable: TriggerRecordable.Yes
}

const generator: TriggerGenerator = (hearingOutcome) => {
  return generateTriggersFromResultCode(hearingOutcome, config)
}

export default generator
