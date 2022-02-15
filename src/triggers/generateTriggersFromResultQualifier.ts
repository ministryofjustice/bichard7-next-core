import type { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import type { Trigger } from "src/types/Trigger"
import type TriggerConfig from "src/types/TriggerConfig"

export default (
  courtResult: ResultedCaseMessageParsedXml,
  { triggerCode, resultCodeQualifier }: TriggerConfig
): Trigger[] => {
  if (
    courtResult.Session.Case.Defendant.Offence.some((offence) =>
      offence.Result.some((r) => r.ResultCodeQualifier === resultCodeQualifier)
    )
  ) {
    return [{ code: triggerCode }]
  }

  return []
}
