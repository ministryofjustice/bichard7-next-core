/* eslint-disable prettier/prettier */
import type { OffenceParsedXml, ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import type { Trigger } from "src/types/Trigger"
import { TriggerCode } from "src/types/TriggerCode"

const triggerCode = TriggerCode.TRPR0029
const offenceCodes = [
  "AS14504", "AS14509", "AS14511", "CD98501", "CD98502", "CD98503", "CD98517", "CD98519", "CD98525",
  "CD98529", "CJ08503", "CJ08504", "CJ08505", "CS10501", "FB89501", "FB89506", "MS15501", "MS15502",
  "MS15503", "MS15504,PC00503", "PC00506", "PC09504", "PC09505", "PC09510", "PH97503"
]
const offenceCodesForGrantedResultText = [
  "AS14501", "AS14502", "AS14503", "AS14505", "AS14506", "AS14507", "AS14508", "AS14510", "AS14512",
  "AS14513", "CC81501", "CD98510", "CD98516", "CD98518", "CD98527", "CD98528", "CJ03509", "CJ03513",
  "CJ03519", "CJ03520", "CJ08506", "CJ08508", "CJ08522", "FB89502", "FB89503", "MC80515", "PC09501",
  "PC09502", "PC09503", "PC09506", "PC09507", "PC09508", "PC09509", "PC09511", "PH97501", "PH97502",
  "PL84503", "RO88504", "RO88505", "SX03505", "SX03506", "SX03507", "SX03508", "SX03509", "SX03510",
  "SX03511", "SX03512", "SX03513", "SX03514", "SX03515", "SX03516", "SX03517", "SX03518", "SX03519",
  "SX03520", "SX03521", "SX03522", "SX03523", "SX03524", "SX03525", "SX03526", "SX03527", "SX03528",
  "SX03529", "SX03530", "SX03531", "SX03532", "TR08500", "TR08501", "TR08502", "TR08503", "VC06501",
  "VC06502", "VC06503", "VC06504", "VC06505", "YJ99501", "YJ99503"
]

const containsOffenceCodeForGranted = (offence: OffenceParsedXml) =>
  offenceCodesForGrantedResultText.includes(offence.BaseOffenceDetails.OffenceCode) &&
  offence.Result.some((result) => /granted/i.test(result.ResultText))

export default (courtResult: ResultedCaseMessageParsedXml, recordable: boolean): Trigger[] => {
  const shouldRaiseTrigger =
    !recordable &&
    courtResult.Session.Case.Defendant.Offence.some(
      (offence) =>
        offenceCodes.includes(offence.BaseOffenceDetails.OffenceCode) || containsOffenceCodeForGranted(offence)
    )

  return shouldRaiseTrigger ? [{ code: triggerCode }] : []
}
