import { TriggerCode } from "src/types/TriggerCode"
import type TriggerConfig from "src/types/TriggerConfig"
import type { TriggerGenerator } from "src/types/TriggerGenerator"
import TriggerRecordable from "src/types/TriggerRecordable"
import generateTriggersFromResultQualifier from "./generateTriggersFromResultQualifier"

const config: TriggerConfig = {
  triggerCode: TriggerCode.TRPR0023,
  resultCodeQualifier: "LG",
  caseLevelTrigger: true,
  triggerRecordable: TriggerRecordable.Both
}

const generator: TriggerGenerator = {
  independent: true,
  generate: (hearingOutcome, _) => generateTriggersFromResultQualifier(hearingOutcome, config)
}

export default generator
