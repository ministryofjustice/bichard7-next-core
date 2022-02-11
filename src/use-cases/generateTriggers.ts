import { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage";
import triggers from "src/triggers";
import { Trigger } from "src/types/Trigger";
import { TriggerGenerator } from "src/types/TriggerGenerator";

export default (courtResult: ResultedCaseMessageParsedXml): Trigger[] => (
    Object.values(triggers).reduce((acc: Trigger[], trigger: TriggerGenerator) => {
        return acc.concat(trigger(courtResult))
    }, [])
)
