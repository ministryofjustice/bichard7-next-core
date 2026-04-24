import type { AddDisposalRequest } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import * as CONSTANT from "../../../constants"

import { convertToPncDate } from "../helpers/convertToPncDateTime"
import { extractCourtCode, extractCourtName } from "../helpers/formatters"
import generateRow from "../helpers/generateRow"

const crtSegmentGenerator = (mockJson: AddDisposalRequest): string | undefined => {
  if (!mockJson.carryForward?.appearanceDate) {
    return undefined
  }

  const courtDate = convertToPncDate(mockJson.carryForward.appearanceDate)

  return generateRow("CRT", [
    [CONSTANT.OFFENCE_UPDATE_TYPE, CONSTANT.UPDATE_TYPE_FIELD_LENGTH],
    [extractCourtCode(mockJson.court), CONSTANT.COURT_CODE_FIELD_LENGTH],
    [extractCourtName(mockJson.court), CONSTANT.COURT_NAME_FIELD_LENGTH],
    [courtDate, CONSTANT.DATE_OF_HEARING_FIELD_LENGTH]
  ])
}

export default crtSegmentGenerator
