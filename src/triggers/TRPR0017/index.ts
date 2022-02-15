import type { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import type { Trigger } from "src/types/Trigger"
import { TriggerCode } from "src/types/TriggerCode"
import type TriggerConfig from "src/types/TriggerConfig"
import TriggerRecordable from "src/types/TriggerRecordable"
import generateTriggersFromResultCode from "../generateTriggersFromResultCode"

const config: TriggerConfig = {
  triggerCode: TriggerCode.TRPR0017,
  resultCodesForTrigger: [2007],
  caseLevelTrigger: false,
  triggerRecordable: TriggerRecordable.Yes
}

export default (courtResult: ResultedCaseMessageParsedXml, recordable: boolean): Trigger[] =>
  generateTriggersFromResultCode(courtResult, config, recordable)
