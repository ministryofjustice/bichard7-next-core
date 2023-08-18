/* eslint-disable prettier/prettier */
import type { Offence, Result } from "core/common/types/AnnotatedHearingOutcome"
import { TriggerCode } from "core/common/types/TriggerCode"
import { CjsVerdict } from "core/phase1/types/Verdict"
import getOffenceFullCode from "../lib/offence/getOffenceFullCode"
import resultCodeIsFinal from "../lib/result/resultCodeIsFinal"
import type { Trigger } from "../types/Trigger"
import type { TriggerGenerator } from "../types/TriggerGenerator"

const triggerCode = TriggerCode.TRPR0020
const resultCodes = [1029, 1030, 1031, 1032, 3501]
const excludedResultCodes = [1000, 1040]
// prettier-ignore
const offenceCodes = [
  "CD98001", "CD98019", "CD98020", "CD98021", "CD98058", "CJ03506", "CJ03507", "CJ03510", "CJ03511",
  "CJ03522", "CJ03523", "CJ08507", "CJ08512", "CJ08519", "CJ08521", "CJ08526", "CJ91001", "CJ91002",
  "CJ91028", "CJ91029", "CJ91031", "CJ91039", "CS97001", "FB89004", "LP80001", "MC80002", "MC80508",
  "MC80601", "PC00003", "PC00004", "PC00005", "PC00006", "PC00007", "PC00008", "PC00009", "PC00010",
  "PC00501", "PC00502", "PC00504", "PC00505", "PC00515", "PC00525", "PC00535", "PC00545", "PC00555",
  "PC00565", "PC00575", "PC00585", "PC00595", "PC00605", "PC00615", "PC00625", "PC00635", "PC00645",
  "PC00655", "PC00665", "PC00700", "PC00702", "PC73003", "PU86051", "PU86089", "PU86118", "SC07001",
  "SE20501", "SE20502", "SE20511", "SE20512", "SE20516", "SE20517", "SE20518", "SE20521", "SE20525",
  "SE20532", "SE20537", "SE20538", "SE20540", "SE20542", "SE20546", "SE20547", "SE20552", "SO59501",
  "ST19001", "SX03202", "SX03220", "SX03221", "SX03222", "SX03223"
]

const resultCodeIsExcluded = (resultCode: number): boolean => excludedResultCodes.includes(resultCode)

const hasGuiltyResult = (result: Result) => result.Verdict !== CjsVerdict.NotGuilty

const containsOffenceCode = (offence: Offence) => {
  const fullCode = getOffenceFullCode(offence)
  return (
    fullCode &&
    offenceCodes.includes(fullCode.substring(0, 7)) &&
    offence.Result.some(
      (result) =>
        hasGuiltyResult(result) &&
        result.CJSresultCode &&
        !resultCodeIsExcluded(result.CJSresultCode) &&
        resultCodeIsFinal(result.CJSresultCode)
    )
  )
}

const containsResultCode = (offence: Offence) =>
  offence.Result.some((result) => result.CJSresultCode && resultCodes.includes(result.CJSresultCode))

const generator: TriggerGenerator = (hearingOutcome) => {
  return hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.reduce(
    (acc: Trigger[], offence) => {
      if (containsResultCode(offence) || containsOffenceCode(offence)) {
        acc.push({ code: triggerCode, offenceSequenceNumber: offence.CourtOffenceSequenceNumber })
      }

      return acc
    },
    []
  )
}

export default generator
