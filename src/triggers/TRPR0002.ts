import type { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import type { Trigger } from "src/types/Trigger"
import { TriggerCode } from "src/types/TriggerCode"

const triggerCode = TriggerCode.TRPR0002
const resultCodes = [4575, 4576, 4577, 4585, 4586]
const resultQualifier = "EO"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (courtResult: ResultedCaseMessageParsedXml, _: boolean): Trigger[] => {
  const shouldRaiseTrigger = courtResult.Session.Case.Defendant.Offence.some((offence) =>
    offence.Result.some(
      (result) => resultCodes.includes(result.ResultCode) && !result.ResultCodeQualifier.includes(resultQualifier)
    )
  )

  if (shouldRaiseTrigger) {
    return [{ code: triggerCode }]
  }

  return []
}
