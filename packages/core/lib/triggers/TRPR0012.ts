import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import type TriggerConfig from "../../types/TriggerConfig"
import type { TriggerGenerator } from "../../types/TriggerGenerator"

import TriggerRecordable from "../../types/TriggerRecordable"
import generateTriggersFromResultCode from "./generateTriggersFromResultCode"

const config: TriggerConfig = {
  caseLevelTrigger: true,
  resultCodesForTrigger: [2509],
  triggerCode: TriggerCode.TRPR0012,
  triggerRecordable: TriggerRecordable.Both
}

const generator: TriggerGenerator = (hearingOutcome) => generateTriggersFromResultCode(hearingOutcome, config)

export default generator
