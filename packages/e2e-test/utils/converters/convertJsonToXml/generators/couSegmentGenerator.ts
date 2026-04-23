import type { Defendant } from "@moj-bichard7/core/types/leds/DisposalRequest"
import type { MockAddDisposalRequest } from "../../../../types/MockAddDisposalRequest"
import * as CONSTANT from "../../../constants"
import { convertToPncDate } from "../helpers/convertToPncDateTime"
import { extractCourtCode, extractCourtName } from "../helpers/formatters"
import generateRow from "../helpers/generateRow"

const extractPNCFileName = (defendant: Defendant): string =>
  defendant.defendantType === "individual"
    ? `${defendant.defendantLastName}/${defendant.defendantFirstNames?.join("")}`
    : ""

const couSegmentGenerator = (mockJson: MockAddDisposalRequest): string => {
  const courtCode = extractCourtCode(mockJson.court)
  const courtName = extractCourtName(mockJson.court)
  const generatedPNCFileName = extractPNCFileName(mockJson.defendant)
  const dateOfHearing = convertToPncDate(mockJson.dateOfConviction)

  const couSegment = generateRow("COU", [
    [CONSTANT.OFFENCE_UPDATE_TYPE, CONSTANT.UPDATE_TYPE_FIELD_LENGTH],
    [courtCode, CONSTANT.COURT_CODE_FIELD_LENGTH],
    [courtName, CONSTANT.COURT_NAME_FIELD_LENGTH],
    [generatedPNCFileName, CONSTANT.NAME_CONVICTED_FIELD_LENGTH],
    [dateOfHearing, CONSTANT.DATE_OF_HEARING_FIELD_LENGTH],
    ["0000", CONSTANT.NUMBER_OF_TICS_FIELD_LENGTH]
  ])

  return couSegment
}

export default couSegmentGenerator
