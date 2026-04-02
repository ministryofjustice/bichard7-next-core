import type { AddDisposalRequest } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import {
  COURT_CODE_FIELD_LENGTH,
  COURT_NAME_FIELD_LENGTH,
  DATE_OF_HEARING_FIELD_LENGTH,
  OFFENCE_UPDATE_TYPE,
  UPDATE_TYPE_FIELD_LENGTH
} from "../../../constants"

import { convertToPncDate } from "../helpers/convertToPncDateTime"
import { extractCourtCode, extractCourtName } from "../helpers/formatters"
import generateRow from "../helpers/generateRow"

const crtSegmentGenerator = (ledsJson: AddDisposalRequest): string | undefined => {
  const courtDate = ledsJson.carryForward?.appearanceDate && convertToPncDate(ledsJson.carryForward.appearanceDate)

  if (!courtDate) {
    return undefined
  }

  return generateRow("CRT", [
    [OFFENCE_UPDATE_TYPE, UPDATE_TYPE_FIELD_LENGTH],
    [extractCourtCode(ledsJson.court), COURT_CODE_FIELD_LENGTH],
    [extractCourtName(ledsJson.court), COURT_NAME_FIELD_LENGTH],
    [courtDate, DATE_OF_HEARING_FIELD_LENGTH]
  ])
}

export default crtSegmentGenerator
