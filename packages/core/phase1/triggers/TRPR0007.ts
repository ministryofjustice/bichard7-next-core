import { TriggerCode } from "../../types/TriggerCode"
import generateTriggersFromResultCode from "../triggers/generateTriggersFromResultCode"
import type TriggerConfig from "../types/TriggerConfig"
import type { TriggerGenerator } from "../types/TriggerGenerator"
import TriggerRecordable from "../types/TriggerRecordable"

const config: TriggerConfig = {
  triggerCode: TriggerCode.TRPR0007,
  resultCodesForTrigger: [2065],
  caseLevelTrigger: true,
  triggerRecordable: TriggerRecordable.Both
}

const generator: TriggerGenerator = (hearingOutcome) => generateTriggersFromResultCode(hearingOutcome, config)

export default generator
