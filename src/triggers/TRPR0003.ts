import type { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import type { Trigger } from "src/types/Trigger"
import { TriggerCode } from "src/types/TriggerCode"

const triggerCode = TriggerCode.TRPR0003
const mainResultCodes = [
  1100, 1177, 1178, 3034, 3041, 3047, 3068, 3078, 3080, 3082, 3106, 3100, 3115, 3121, 3122, 3123, 3124, 3125, 3133,
  3284, 3285, 3288, 4590
]
const yroResultCodes = [1141, 1142, 1143]
const yroSpeceficRequirementResultCodes = [3104, 3105, 3107]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (courtResult: ResultedCaseMessageParsedXml, _: boolean): Trigger[] =>
  courtResult.Session.Case.Defendant.Offence.reduce((acc: Trigger[], offence) => {
    const containsMainResultCode = offence.Result.some((result) => mainResultCodes.includes(result.ResultCode))
    const containsYroResultCode = offence.Result.some((result) => yroResultCodes.includes(result.ResultCode))
    const containsYroSpeceficRequirementResultCode = offence.Result.some((result) =>
      yroSpeceficRequirementResultCodes.includes(result.ResultCode)
    )

    if (containsMainResultCode || (containsYroResultCode && containsYroSpeceficRequirementResultCode)) {
      acc.push({ code: triggerCode, offenceSequenceNumber: offence.BaseOffenceDetails.OffenceSequenceNumber })
    }

    return acc
  }, [])
