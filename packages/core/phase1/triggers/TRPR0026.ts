import { TriggerCode } from "types/TriggerCode"
import type TriggerConfig from "phase1/types/TriggerConfig"
import type { TriggerGenerator } from "phase1/types/TriggerGenerator"
import TriggerRecordable from "phase1/types/TriggerRecordable"
import generateTriggersFromResultCode from "phase1/triggers/generateTriggersFromResultCode"

const config: TriggerConfig = {
  triggerCode: TriggerCode.TRPR0026,
  resultCodesForTrigger: [3075, 3076],
  caseLevelTrigger: false,
  triggerRecordable: TriggerRecordable.Both
}

const generator: TriggerGenerator = (hearingOutcome) => generateTriggersFromResultCode(hearingOutcome, config)

export default generator
