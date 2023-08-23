import { TriggerCode } from "types/TriggerCode"
import type TriggerConfig from "phase1/types/TriggerConfig"
import type { TriggerGenerator } from "phase1/types/TriggerGenerator"
import TriggerRecordable from "phase1/types/TriggerRecordable"
import generateTriggersFromResultQualifier from "phase1/triggers/generateTriggersFromResultQualifier"

const config: TriggerConfig = {
  triggerCode: TriggerCode.TRPR0024,
  resultCodeQualifier: "LH",
  caseLevelTrigger: true,
  triggerRecordable: TriggerRecordable.Both
}

const generator: TriggerGenerator = (hearingOutcome) => generateTriggersFromResultQualifier(hearingOutcome, config)

export default generator
