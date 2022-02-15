import type { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import type { Trigger } from "src/types/Trigger"
import { TriggerCode } from "src/types/TriggerCode"
import type TriggerConfig from "src/types/TriggerConfig"
import TriggerRecordable from "src/types/TriggerRecordable"
import generateTriggersFromResultCode from "../generateTriggersFromResultCode"

const config: TriggerConfig = {
  triggerCode: TriggerCode.TRPR0006,
  resultCodesForTrigger: [
    1002, 1003, 1004, 1007, 1008, 1024, 1055, 1056, 1058, 1073, 1074, 1075, 1077, 1080, 1081, 1088, 1091, 1092, 1093,
    1110, 1111, 1121, 1126, 1133, 1507, 3053, 3132
  ],
  caseLevelTrigger: true,
  triggerRecordable: TriggerRecordable.Both
}

export default (courtResult: ResultedCaseMessageParsedXml, recordable: boolean): Trigger[] =>
  generateTriggersFromResultCode(courtResult, config, recordable)
