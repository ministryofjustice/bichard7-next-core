import { TriggerCode } from "types/TriggerCode"
import type TriggerConfig from "phase1/types/TriggerConfig"
import type { TriggerGenerator } from "phase1/types/TriggerGenerator"
import TriggerRecordable from "phase1/types/TriggerRecordable"
import generateTriggersFromResultCode from "phase1/triggers/generateTriggersFromResultCode"

const config: TriggerConfig = {
  triggerCode: TriggerCode.TRPR0019,
  resultCodesForTrigger: [4017, 4046, 4055, 4561],
  caseLevelTrigger: true,
  triggerRecordable: TriggerRecordable.Both
}

const generator: TriggerGenerator = (hearingOutcome) => generateTriggersFromResultCode(hearingOutcome, config)

export default generator
