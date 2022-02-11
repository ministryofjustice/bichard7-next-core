import type { ResultedCaseMessageParsedXml } from "./IncomingMessage"
import type { Trigger } from "./Trigger"

export type TriggerGenerator = (a: ResultedCaseMessageParsedXml) => Trigger[]
