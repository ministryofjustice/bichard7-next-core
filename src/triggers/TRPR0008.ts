import { Guilt } from "src/types/Guilt"
import type { OffenceParsedXml, ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import { Plea } from "src/types/Plea"
import type { Trigger } from "src/types/Trigger"
import { TriggerCode } from "src/types/TriggerCode"

const triggerCode = TriggerCode.TRPR0008
const offenceCodes = ["BA76004", "BA76005"]

const isMatchingOffence = (offence: OffenceParsedXml) =>
  offenceCodes.includes(offence.BaseOffenceDetails.OffenceCode) &&
  (offence.Finding === Guilt.Guilty || offence.Plea === Plea.Admits)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (courtResult: ResultedCaseMessageParsedXml, _: boolean): Trigger[] => {
  if (courtResult.Session.Case.Defendant.Offence.some(isMatchingOffence)) {
    return [{ code: triggerCode }]
  }
  return []
}
