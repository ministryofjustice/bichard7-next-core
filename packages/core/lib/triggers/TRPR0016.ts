import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import type TriggerConfig from "../../types/TriggerConfig"
import type { TriggerGenerator } from "../../types/TriggerGenerator"

import TriggerRecordable from "../../types/TriggerRecordable"
import generateTriggersFromResultCode from "./generateTriggersFromResultCode"

const config: TriggerConfig = {
  caseLevelTrigger: false,
  resultCodesForTrigger: [3055, 3056, 3134, 3135, 3136, 3137, 3138],
  triggerCode: TriggerCode.TRPR0016,
  triggerRecordable: TriggerRecordable.Yes
}

const generator: TriggerGenerator = (hearingOutcome) => {
  return generateTriggersFromResultCode(hearingOutcome, config)
}

export default generator
