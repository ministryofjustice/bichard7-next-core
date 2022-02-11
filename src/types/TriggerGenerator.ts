import { ResultedCaseMessageParsedXml } from "./IncomingMessage";
import { Trigger } from "./Trigger";

export type TriggerGenerator = (a: ResultedCaseMessageParsedXml) => Trigger[];
