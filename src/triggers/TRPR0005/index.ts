import { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage";
import { Trigger } from "src/types/Trigger";
import { TriggerCode } from "src/types/TriggerCode";
import generateTriggersFromResultCode from "../generateTriggersFromResultCode";

const code = TriggerCode.TRPR0005
const validResultCodes = [4012, 4016, 4028, 4032, 4049, 4050, 4051, 4053, 4054, 4056, 4057, 4058, 4541, 4560, 4564, 4588]

export default (courtResult: ResultedCaseMessageParsedXml): Trigger[] => (
    generateTriggersFromResultCode(courtResult, code, validResultCodes, true)
)
