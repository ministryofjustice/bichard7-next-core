import type { AddDisposalRequest } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import * as CONSTANT from "../../../constants"

import { convertToPncDate } from "../helpers/convertToPncDateTime"
import { extractCourtCode, extractCourtName } from "../helpers/formatters"
import generateRow from "../helpers/generateRow"

const crtSegmentGenerator = (ledsJson: AddDisposalRequest): string | undefined => {
  if (!ledsJson.carryForward?.appearanceDate) {
    return undefined
  }

  const courtDate = convertToPncDate(ledsJson.carryForward.appearanceDate)

  return generateRow("CRT", [
    [CONSTANT.OFFENCE_UPDATE_TYPE, CONSTANT.UPDATE_TYPE_FIELD_LENGTH],
    [extractCourtCode(ledsJson.court), CONSTANT.COURT_CODE_FIELD_LENGTH],
    [extractCourtName(ledsJson.court), CONSTANT.COURT_NAME_FIELD_LENGTH],
    [courtDate, CONSTANT.DATE_OF_HEARING_FIELD_LENGTH]
  ])
}

export default crtSegmentGenerator
