import type { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import type { Trigger } from "src/types/Trigger"
import { TriggerCode } from "src/types/TriggerCode"
import type TriggerConfig from "src/types/TriggerConfig"
import TriggerRecordable from "src/types/TriggerRecordable"
import generateTriggersFromResultCode from "../generateTriggersFromResultCode"

const config: TriggerConfig = {
  triggerCode: TriggerCode.TRPR0001,
  resultCodesForTrigger: [3007, 3028, 3030, 3050, 3051, 3070, 3071, 3072, 3073, 3074, 3094, 3095, 3096],
  caseLevelTrigger: false,
  triggerRecordable: TriggerRecordable.Both
}

export default (courtResult: ResultedCaseMessageParsedXml, recordable: boolean): Trigger[] =>
  generateTriggersFromResultCode(courtResult, config, recordable)
