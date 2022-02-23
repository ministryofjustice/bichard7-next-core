import type { OffenceParsedXml, ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import type { Trigger } from "src/types/Trigger"
import { TriggerCode } from "src/types/TriggerCode"

const triggerCode = TriggerCode.TRPR0030
const offenceCodes = ["PL84504", "PL84505", "PL84506"]

const isMatchingOffence = (offence: OffenceParsedXml) => offenceCodes.includes(offence.BaseOffenceDetails.OffenceCode)

export default (courtResult: ResultedCaseMessageParsedXml, recordable: boolean): Trigger[] => {
  if (!recordable && courtResult.Session.Case.Defendant.Offence.some(isMatchingOffence)) {
    return [{ code: triggerCode }]
  }
  return []
}
