import type { AddDisposalRequest } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import type { Defendant } from "@moj-bichard7/core/types/leds/DisposalRequest"
import * as C from "../../../constants"
import { convertToPncDate } from "../helpers/convertToPncDateTime"
import { extractCourtCode, extractCourtName } from "../helpers/extractCourtDetails"
import generateRow from "../helpers/generateRow"

const extractPNCFileName = (defendant: Defendant): string =>
  defendant.defendantType === "individual"
    ? `${defendant.defendantLastName}/${defendant.defendantFirstNames?.join("")}`
    : ""

const couSegmentGenerator = (ledsJson: AddDisposalRequest): string => {
  const courtCode = extractCourtCode(ledsJson.court)
  const courtName = extractCourtName(ledsJson.court)
  const generatedPNCFileName = extractPNCFileName(ledsJson.defendant)
  const dateOfHearing = convertToPncDate(ledsJson.dateOfConviction)

  const couSegment = generateRow("COU", [
    [courtCode, C.COURT_CODE_FIELD_LENGTH],
    [courtName, C.COURT_NAME_FIELD_LENGTH],
    [generatedPNCFileName, C.NAME_CONVICTED_FIELD_LENGTH],
    [dateOfHearing, C.DATE_OF_HEARING_FIELD_LENGTH],
    ["", C.NUMBER_OF_TICS_FIELD_LENGTH]
  ])

  return couSegment
}

export default couSegmentGenerator
