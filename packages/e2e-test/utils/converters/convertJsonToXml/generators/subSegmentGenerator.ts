import type { ReasonForAppearance } from "@moj-bichard7/core/types/leds/SubsequentDisposalResultsRequest"
import type { MockSubsequentDisposalResultsRequest } from "../../../../types/MockSubsequentDisposalResultsRequest"
import * as CONSTANT from "../../../constants"
import { convertToPncDate } from "../helpers/convertToPncDateTime"
import { extractCourtCode } from "../helpers/formatters"
import generateRow from "../helpers/generateRow"

const hearingTypeMap: Record<ReasonForAppearance, string> = {
  "Subsequently Varied": "V",
  "Sentence Deferred": "D",
  "Heard at Court": ""
}

const subSegmentGenerator = (ledsJson: MockSubsequentDisposalResultsRequest): string => {
  return generateRow("SUB", [
    [CONSTANT.OFFENCE_UPDATE_TYPE, CONSTANT.UPDATE_TYPE_FIELD_LENGTH],
    [extractCourtCode(ledsJson.court), CONSTANT.COURT_HOUSE_CODE_FIELD_LENGTH],
    [convertToPncDate(ledsJson.appearanceDate), CONSTANT.HEARING_DATE_FIELD_LENGTH],
    [hearingTypeMap[ledsJson.reasonForAppearance], CONSTANT.HEARING_TYPE_FIELD_LENGTH]
  ])
}

export default subSegmentGenerator
