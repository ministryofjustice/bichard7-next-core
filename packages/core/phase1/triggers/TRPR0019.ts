import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import generateTriggersFromResultCode from "../triggers/generateTriggersFromResultCode"
import type TriggerConfig from "../types/TriggerConfig"
import type { TriggerGenerator } from "../types/TriggerGenerator"
import TriggerRecordable from "../types/TriggerRecordable"

const config: TriggerConfig = {
  triggerCode: TriggerCode.TRPR0019,
  resultCodesForTrigger: [4017, 4046, 4055, 4561],
  caseLevelTrigger: true,
  triggerRecordable: TriggerRecordable.Both
}

const generator: TriggerGenerator = (hearingOutcome) => generateTriggersFromResultCode(hearingOutcome, config)

export default generator
