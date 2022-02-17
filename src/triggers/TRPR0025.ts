import type { OffenceParsedXml, ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import type { Trigger } from "src/types/Trigger"
import { TriggerCode } from "src/types/TriggerCode"

const triggerCode = TriggerCode.TRPR0025
const validMatches = [
  { offenceCode: "MC80524", resultCode: 4584 },
  { offenceCode: "MC80527", resultCode: 3049 },
  { offenceCode: "MC80528", resultCode: 3049 }
]

const offenceMatches = (offence: OffenceParsedXml, offenceCode: string, resultCode: number) =>
  offence.BaseOffenceDetails.OffenceCode === offenceCode &&
  offence.Result.some((result) => result.ResultCode === resultCode)

const matchingOffenceCodeAndResultCode = (
  courtResult: ResultedCaseMessageParsedXml,
  offenceCode: string,
  resultCode: number
) => courtResult.Session.Case.Defendant.Offence.some((offence) => offenceMatches(offence, offenceCode, resultCode))

const matches = (courtResult: ResultedCaseMessageParsedXml): boolean =>
  validMatches.some(({ offenceCode, resultCode }) =>
    matchingOffenceCodeAndResultCode(courtResult, offenceCode, resultCode)
  )

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (courtResult: ResultedCaseMessageParsedXml, _: boolean): Trigger[] => {
  if (matches(courtResult)) {
    return [{ code: triggerCode }]
  }
  return []
}
