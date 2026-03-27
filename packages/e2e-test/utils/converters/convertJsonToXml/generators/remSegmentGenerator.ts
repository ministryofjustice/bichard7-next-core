import type { Court } from "@moj-bichard7/core/types/leds/DisposalRequest"
import type { MockRemandRequest } from "../../../../types/MockRemandRequest"
import * as C from "../../../constants"
import { convertToPncDate } from "../helpers/convertToPncDate"
import generateRow from "../helpers/generateRow"

const extractCourtCode = (court: Court | undefined): string | undefined =>
  court?.courtIdentityType === "code" ? court.courtCode : undefined

const extractCourtName = (court: Court | undefined): string | undefined =>
  court?.courtIdentityType === "name" ? court.courtName : undefined

const remSegmentGenerator = (ledsJson: MockRemandRequest): string => {
  const currentAppearance = ledsJson.currentAppearance?.court
  const nextAppearance = ledsJson.nextAppearance?.court

  const remandDate = convertToPncDate(ledsJson.remandDate)
  const remandResult = ledsJson.remandResult
  const remandLocationFfss = ledsJson.remandLocationFfss
  const remandLocationCourt = extractCourtCode(currentAppearance)
  const courtNameType1 = extractCourtName(currentAppearance)
  const nextAppearanceDate = ledsJson.nextAppearance?.date && convertToPncDate(ledsJson.nextAppearance.date)
  const nextAppearanceLocation = extractCourtCode(nextAppearance)
  const courtNameType2 = extractCourtName(nextAppearance)
  const bailConditions = ledsJson.bailConditions.join("")
  const localAuthorityCode = "0000"

  const unimplementedFields: [string, number][] = [
    ["", C.BAIL_ADDRESS_FIELD_LENGTH],
    ["", C.BREACH_OF_BAIL_CONDITIONS_FIELD_LENGTH],
    ["", C.CUSTODY_FORCE_STATION_CODE_FIELD_LENGTH],
    ["", C.INSTITUTION_CODE_FIELD_LENGTH],
    ["", C.PRISONER_NUMBER_FIELD_LENGTH],
    ["", C.CUSTODY_TEXT_FIELD_LENGTH],
    ["", C.NEXT_APPEARANCE_LOCATION_FFSS_FIELD_LENGTH],
    [localAuthorityCode, C.LOCAL_AUTHORITY_CODE_FIELD_LENGTH],
    ["", C.LOCAL_AUTHORITY_NAME_FIELD_LENGTH],
    ["", C.LOCAL_AUTHORITY_SECURE_UNIT_MARKER_FIELD_LENGTH],
    ["", C.SOCIAL_WORKER_NAME_FIELD_LENGTH],
    ["", C.SOCIAL_WORKER_TELEPHONE_FIELD_LENGTH]
  ]

  const remSegment = generateRow("REM", [
    [C.OFFENCE_UPDATE_TYPE, C.UPDATE_TYPE_FIELD_LENGTH],
    [remandDate, C.REMAND_DATE_FIELD_LENGTH],
    [remandResult, C.REMAND_RESULT_FIELD_LENGTH],
    [remandLocationFfss, C.REMAND_LOCATION_FFSS_FIELD_LENGTH],
    [remandLocationCourt, C.REMAND_LOCATION_COURT_FIELD_LENGTH],
    [courtNameType1, C.COURT_NAME_TYPE1_FIELD_LENGTH],
    [nextAppearanceDate, C.NEXT_APPEARANCE_DATE_FIELD_LENGTH],
    [nextAppearanceLocation, C.NEXT_APPEARANCE_LOCATION_FIELD_LENGTH],
    [courtNameType2, C.COURT_NAME_TYPE2_FIELD_LENGTH],
    [bailConditions, C.BAIL_CONDITIONS_FIELD_LENGTH],
    ...unimplementedFields
  ])

  return remSegment
}

export default remSegmentGenerator
