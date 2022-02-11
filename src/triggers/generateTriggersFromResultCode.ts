import { OffenceParsedXml, ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import { Trigger } from "src/types/Trigger"
import { TriggerCode } from "src/types/TriggerCode"

export default (courtResult: ResultedCaseMessageParsedXml, triggerCode: TriggerCode, resultCodesForTrigger: number[]) => {
    const shouldTrigger = (offence: OffenceParsedXml): boolean => (
        offence.Result.some(result => resultCodesForTrigger.includes(result.ResultCode))
    )

    const generateTriggers = (acc: Trigger[], offence: OffenceParsedXml): Trigger[] => {
        if (shouldTrigger(offence)) {
            acc.push({
                code: triggerCode,
                offenceSequenceNumber: offence.BaseOffenceDetails.OffenceSequenceNumber
            })
        }
        return acc
    }

    return courtResult.Session.Case.Defendant.Offence.reduce(generateTriggers, [])
}
