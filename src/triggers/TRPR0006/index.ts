import { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage";
import { Trigger } from "src/types/Trigger";
import { TriggerCode } from "src/types/TriggerCode";
import generateTriggersFromResultCode from "../generateTriggersFromResultCode";

const code = TriggerCode.TRPR0006
const validResultCodes = [1002, 1003, 1004, 1007, 1008, 1024, 1055, 1056, 1058, 1073, 1074, 1075, 1077, 1080, 1081, 1088, 1091, 1092, 1093, 1110, 1111, 1121, 1126, 1133, 1507, 3053, 3132]

export default (courtResult: ResultedCaseMessageParsedXml): Trigger[] => (
    generateTriggersFromResultCode(courtResult, code, validResultCodes, true)
)
