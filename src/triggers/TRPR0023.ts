import type { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import type { Trigger } from "src/types/Trigger"
import { TriggerCode } from "src/types/TriggerCode"
import type TriggerConfig from "src/types/TriggerConfig"
import TriggerRecordable from "src/types/TriggerRecordable"

const config: TriggerConfig = {
  triggerCode: TriggerCode.TRPR0023,
  resultCodeQualifier: "LG",
  caseLevelTrigger: true,
  triggerRecordable: TriggerRecordable.Both
}

export default (courtResult: ResultedCaseMessageParsedXml, _: boolean): Trigger[] => {
  if (
    courtResult.Session.Case.Defendant.Offence.some((offence) =>
      offence.Result.some((r) => r.ResultCodeQualifier === config.resultCodeQualifier)
    )
  ) {
    return [{ code: config.triggerCode }]
  }

  return []
}
