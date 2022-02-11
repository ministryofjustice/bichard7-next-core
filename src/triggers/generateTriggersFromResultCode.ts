import type { OffenceParsedXml, ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import type { Trigger } from "src/types/Trigger"
import type { TriggerCode } from "src/types/TriggerCode"

export default (
  courtResult: ResultedCaseMessageParsedXml,
  triggerCode: TriggerCode,
  resultCodesForTrigger: number[],
  caseLevelTrigger = false
) => {
  const shouldTrigger = (offence: OffenceParsedXml): boolean =>
    offence.Result.some((result) => resultCodesForTrigger.includes(result.ResultCode))

  const generateTriggers = (acc: Trigger[], offence: OffenceParsedXml): Trigger[] => {
    if (shouldTrigger(offence)) {
      acc.push({
        code: triggerCode,
        offenceSequenceNumber: offence.BaseOffenceDetails.OffenceSequenceNumber
      })
    }
    return acc
  }

  const triggers = courtResult.Session.Case.Defendant.Offence.reduce(generateTriggers, [])
  if (caseLevelTrigger) {
    return triggers.length > 0 ? [{ code: triggerCode }] : []
  }
  return triggers
}
