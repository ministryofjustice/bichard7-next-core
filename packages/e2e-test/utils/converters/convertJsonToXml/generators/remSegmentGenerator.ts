import type { MockRemandRequest } from "../../../../types/MockRemandRequest"
import * as CONSTANT from "../../../constants"
import { convertToPncDate } from "../helpers/convertToPncDateTime"
import { extractCourtCode, extractCourtName } from "../helpers/formatters"
import generateRow from "../helpers/generateRow"

const remSegmentGenerator = (mockJson: MockRemandRequest): string => {
  const currentAppearance = mockJson.currentAppearance?.court
  const nextAppearance = mockJson.nextAppearance?.court

  const remandDate = convertToPncDate(mockJson.remandDate)
  const remandResult = mockJson.remandResult
  const remandLocationFfss = mockJson.remandLocationFfss
  const remandLocationCourt = extractCourtCode(currentAppearance)
  const courtNameType1 = extractCourtName(currentAppearance)
  const nextAppearanceDate = mockJson.nextAppearance?.date && convertToPncDate(mockJson.nextAppearance.date)
  const nextAppearanceLocation = extractCourtCode(nextAppearance)
  const courtNameType2 = extractCourtName(nextAppearance)
  const bailConditions = mockJson.bailConditions.join("")
  const localAuthorityCode = "0000"

  const unimplementedFields: [string, number][] = [
    ["", CONSTANT.BAIL_ADDRESS_FIELD_LENGTH],
    ["", CONSTANT.BREACH_OF_BAIL_CONDITIONS_FIELD_LENGTH],
    ["", CONSTANT.CUSTODY_FORCE_STATION_CODE_FIELD_LENGTH],
    ["", CONSTANT.INSTITUTION_CODE_FIELD_LENGTH],
    ["", CONSTANT.PRISONER_NUMBER_FIELD_LENGTH],
    ["", CONSTANT.CUSTODY_TEXT_FIELD_LENGTH],
    ["", CONSTANT.NEXT_APPEARANCE_LOCATION_FFSS_FIELD_LENGTH],
    [localAuthorityCode, CONSTANT.LOCAL_AUTHORITY_CODE_FIELD_LENGTH],
    ["", CONSTANT.LOCAL_AUTHORITY_NAME_FIELD_LENGTH],
    ["", CONSTANT.LOCAL_AUTHORITY_SECURE_UNIT_MARKER_FIELD_LENGTH],
    ["", CONSTANT.SOCIAL_WORKER_NAME_FIELD_LENGTH],
    ["", CONSTANT.SOCIAL_WORKER_TELEPHONE_FIELD_LENGTH]
  ]

  const remSegment = generateRow("REM", [
    [CONSTANT.OFFENCE_UPDATE_TYPE, CONSTANT.UPDATE_TYPE_FIELD_LENGTH],
    [remandDate, CONSTANT.REMAND_DATE_FIELD_LENGTH],
    [remandResult, CONSTANT.REMAND_RESULT_FIELD_LENGTH],
    [remandLocationFfss, CONSTANT.REMAND_LOCATION_FFSS_FIELD_LENGTH],
    [remandLocationCourt, CONSTANT.REMAND_LOCATION_COURT_FIELD_LENGTH],
    [courtNameType1, CONSTANT.COURT_NAME_FIELD_LENGTH],
    [nextAppearanceDate, CONSTANT.NEXT_APPEARANCE_DATE_FIELD_LENGTH],
    [nextAppearanceLocation, CONSTANT.NEXT_APPEARANCE_LOCATION_FIELD_LENGTH],
    [courtNameType2, CONSTANT.COURT_NAME_FIELD_LENGTH],
    [bailConditions, CONSTANT.BAIL_CONDITIONS_FIELD_LENGTH],
    ...unimplementedFields
  ])

  return remSegment
}

export default remSegmentGenerator
