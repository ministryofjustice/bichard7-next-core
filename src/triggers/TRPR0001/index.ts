import type { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import type { Trigger } from "src/types/Trigger"
import { TriggerCode } from "src/types/TriggerCode"
import generateTriggersFromResultCode from "../generateTriggersFromResultCode"

const code = TriggerCode.TRPR0001
const validResultCodes = [3028, 3030, 3050, 3051, 3070, 3071, 3072, 3073, 3074, 3094, 3095, 3096]

export default (courtResult: ResultedCaseMessageParsedXml): Trigger[] =>
  generateTriggersFromResultCode(courtResult, code, validResultCodes)
