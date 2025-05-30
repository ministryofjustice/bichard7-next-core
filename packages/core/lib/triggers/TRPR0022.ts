import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import type TriggerConfig from "../../types/TriggerConfig"
import type { TriggerGenerator } from "../../types/TriggerGenerator"

import TriggerRecordable from "../../types/TriggerRecordable"
import generateTriggersFromResultCode from "./generateTriggersFromResultCode"

const config: TriggerConfig = {
  triggerCode: TriggerCode.TRPR0022,
  resultCodesForTrigger: [4022, 4067, 4068],
  caseLevelTrigger: true,
  triggerRecordable: TriggerRecordable.Both
}

const generator: TriggerGenerator = (hearingOutcome) => generateTriggersFromResultCode(hearingOutcome, config)

export default generator
