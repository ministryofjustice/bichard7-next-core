import type { ResultedCaseMessageParsedXml } from "./IncomingMessage"
import type { Trigger } from "./Trigger"

export type TriggerGenerator = (messageXml: ResultedCaseMessageParsedXml, recordable: boolean) => Trigger[]
