import type { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import triggers from "src/triggers"
import type { Trigger } from "src/types/Trigger"
import type { TriggerGenerator } from "src/types/TriggerGenerator"

export default (courtResult: ResultedCaseMessageParsedXml, recordable: boolean): Trigger[] =>
  Object.values(triggers).reduce((acc: Trigger[], trigger: TriggerGenerator) => {
    return acc.concat(trigger(courtResult, recordable))
  }, [])
