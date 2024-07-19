import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type TriggerConfig from "../../types/TriggerConfig"
import type { TriggerGenerator } from "../../types/TriggerGenerator"
import TriggerRecordable from "../../types/TriggerRecordable"
import generateTriggersFromResultQualifier from "./generateTriggersFromResultQualifier"

const config: TriggerConfig = {
  triggerCode: TriggerCode.TRPR0024,
  resultCodeQualifier: "LH",
  caseLevelTrigger: true,
  triggerRecordable: TriggerRecordable.Both
}

const generator: TriggerGenerator = (hearingOutcome) => generateTriggersFromResultQualifier(hearingOutcome, config)

export default generator
