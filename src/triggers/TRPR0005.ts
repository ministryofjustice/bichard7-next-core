import { TriggerCode } from "src/types/TriggerCode"
import type TriggerConfig from "src/types/TriggerConfig"
import type { TriggerGenerator } from "src/types/TriggerGenerator"
import TriggerRecordable from "src/types/TriggerRecordable"
import generateTriggersFromResultCode from "./generateTriggersFromResultCode"

const config: TriggerConfig = {
  triggerCode: TriggerCode.TRPR0005,
  resultCodesForTrigger: [
    4012, 4016, 4028, 4032, 4049, 4050, 4051, 4053, 4054, 4056, 4057, 4058, 4541, 4560, 4564, 4588
  ],
  caseLevelTrigger: true,
  triggerRecordable: TriggerRecordable.Both
}

const generator: TriggerGenerator = (hearingOutcome) => generateTriggersFromResultCode(hearingOutcome, config)

export default generator
