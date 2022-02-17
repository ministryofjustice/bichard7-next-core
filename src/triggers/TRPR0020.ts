/* eslint-disable prettier/prettier */
import type { OffenceParsedXml, ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import type { Trigger } from "src/types/Trigger"
import { TriggerCode } from "src/types/TriggerCode"
import findResultCode from "src/use-cases/findResultCode"

const triggerCode = TriggerCode.TRPR0020
const resultCodes = [1029, 1030, 1031, 1032, 3501]
const excludedResultCodes = [1000, 1040]
const offenceCodes = [
  "CD98001", "CD98019", "CD98020", "CD98021", "CD98058", "CJ03506", "CJ03507", "CJ03510", "CJ03511", 
  "CJ03522", "CJ03523", "CJ08507", "CJ08512", "CJ08519", "CJ08521", "CJ08526", "CJ91001", "CJ91002", 
  "CJ91028", "CJ91029", "CJ91031", "CJ91039", "CS97001", "FB89004", "LP80001", "MC80002", "MC80508", 
  "MC80601", "PC00003", "PC00004", "PC00005", "PC00006", "PC00007", "PC00008", "PC00009", "PC00010", 
  "PC00501", "PC00502", "PC00504", "PC00505", "PC00515", "PC00525", "PC00535", "PC00545", "PC00555", 
  "PC00565", "PC00575", "PC00585", "PC00595", "PC00605", "PC00615", "PC00625", "PC00635", "PC00645", 
  "PC00655", "PC00665", "PC00700", "PC00702", "PC73003", "PU86051", "PU86089", "PU86118", "SC07001", 
  "SO59501", "SX03202", "SX03220", "SX03221", "SX03222", "SX03223"
]

const containsOffenceCode = (offence: OffenceParsedXml) =>
  (offenceCodes.includes(offence.BaseOffenceDetails.OffenceCode) &&
    offence.Result.some((result) => !excludedResultCodes.includes(result.ResultCode) && findResultCode(result.ResultCode).type === "F"))

const containsResultCode = (offence: OffenceParsedXml) =>
  offence.Result.some((result) => resultCodes.includes(result.ResultCode))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (courtResult: ResultedCaseMessageParsedXml, _: boolean): Trigger[] => {
  return courtResult.Session.Case.Defendant.Offence.reduce((acc: Trigger[], offence) => {
    if (offence.Finding !== "NG" && (containsOffenceCode(offence) || containsResultCode(offence))) {
      acc.push({ code: triggerCode, offenceSequenceNumber: offence.BaseOffenceDetails.OffenceSequenceNumber })
    }

    return acc
  }, [])
}
