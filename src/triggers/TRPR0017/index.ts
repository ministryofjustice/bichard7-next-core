import type { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import type { Trigger } from "src/types/Trigger"
import { TriggerCode } from "src/types/TriggerCode"
import generateTriggersFromResultCode from "../generateTriggersFromResultCode"

const code = TriggerCode.TRPR0017
const validResultCodes = [2007]

export default (courtResult: ResultedCaseMessageParsedXml): Trigger[] =>
  generateTriggersFromResultCode(courtResult, code, validResultCodes)
