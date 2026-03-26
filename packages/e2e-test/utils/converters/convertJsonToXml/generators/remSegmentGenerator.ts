import type { MockRemandRequest } from "../../../../types/MockRemandRequest"
import {
  BAIL_ADDRESS_FIELD_LENGTH,
  BAIL_CONDITIONS_FIELD_LENGTH,
  BREACH_OF_BAIL_CONDITIONS_FIELD_LENGTH,
  COURT_NAME_TYPE1_FIELD_LENGTH,
  COURT_NAME_TYPE2_FIELD_LENGTH,
  CUSTODY_FORCE_STATION_CODE_FIELD_LENGTH,
  CUSTODY_TEXT_FIELD_LENGTH,
  INSTITUTION_CODE_FIELD_LENGTH,
  LOCAL_AUTHORITY_CODE_FIELD_LENGTH,
  LOCAL_AUTHORITY_NAME_FIELD_LENGTH,
  LOCAL_AUTHORITY_SECURE_UNIT_MARKER_FIELD_LENGTH,
  NEXT_APPEARANCE_DATE_FIELD_LENGTH,
  NEXT_APPEARANCE_LOCATION_FFSS_FIELD_LENGTH,
  NEXT_APPEARANCE_LOCATION_FIELD_LENGTH,
  PRISONER_NUMBER_FIELD_LENGTH,
  REMAND_DATE_FIELD_LENGTH,
  REMAND_LOCATION_COURT_FIELD_LENGTH,
  REMAND_LOCATION_FFSS_FIELD_LENGTH,
  REMAND_RESULT_FIELD_LENGTH,
  SOCIAL_WORKER_NAME_FIELD_LENGTH,
  SOCIAL_WORKER_TELEPHONE_FIELD_LENGTH
} from "../../../constants"
import { convertToPncDate } from "../helpers/convertToPncDate"
import generateRow from "../helpers/generateRow"

const remSegmentGenerator = (ledsJson: MockRemandRequest): string => {
  const currentAppearance = ledsJson.currentAppearance?.court
  const nextAppearance = ledsJson.nextAppearance?.court

  const remandDate = convertToPncDate(ledsJson.remandDate)
  const remandResult = ledsJson.remandResult
  const remandLocationFfss = ledsJson.remandLocationFfss
  const remandLocationCourt = currentAppearance?.courtIdentityType === "code" ? currentAppearance.courtCode : undefined
  const courtNameType1 = currentAppearance?.courtIdentityType === "name" ? currentAppearance.courtName : undefined
  const nextAppearanceDate = ledsJson.nextAppearance?.date && convertToPncDate(ledsJson.nextAppearance?.date)
  const nextAppearanceLocation = nextAppearance?.courtIdentityType === "code" ? nextAppearance?.courtCode : undefined
  const courtNameType2 = nextAppearance?.courtIdentityType === "name" ? nextAppearance.courtName : undefined
  const bailConditions = ledsJson.bailConditions.join("")
  const bailAddress = ""
  const breachOfBailConditions = ""
  const custodyForceStationCode = ""
  const institutionCode = ""
  const prisonerNumber = ""
  const custodyText = ""
  const nextAppearanceLocationFfss = ""
  const localAuthorityCode = ""
  const localAuthorityName = ""
  const localAuthoritySecureUnitMarker = ""
  const socialWorkerName = ""
  const socialWorkerTelephone = ""

  const remSegment = generateRow("REM", [
    [remandDate, REMAND_DATE_FIELD_LENGTH],
    [remandResult, REMAND_RESULT_FIELD_LENGTH],
    [remandLocationFfss, REMAND_LOCATION_FFSS_FIELD_LENGTH],
    [remandLocationCourt, REMAND_LOCATION_COURT_FIELD_LENGTH],
    [courtNameType1, COURT_NAME_TYPE1_FIELD_LENGTH],
    [nextAppearanceDate, NEXT_APPEARANCE_DATE_FIELD_LENGTH],
    [nextAppearanceLocation, NEXT_APPEARANCE_LOCATION_FIELD_LENGTH],
    [courtNameType2, COURT_NAME_TYPE2_FIELD_LENGTH],
    [bailConditions, BAIL_CONDITIONS_FIELD_LENGTH],
    [bailAddress, BAIL_ADDRESS_FIELD_LENGTH],
    [breachOfBailConditions, BREACH_OF_BAIL_CONDITIONS_FIELD_LENGTH],
    [custodyForceStationCode, CUSTODY_FORCE_STATION_CODE_FIELD_LENGTH],
    [institutionCode, INSTITUTION_CODE_FIELD_LENGTH],
    [prisonerNumber, PRISONER_NUMBER_FIELD_LENGTH],
    [custodyText, CUSTODY_TEXT_FIELD_LENGTH],
    [nextAppearanceLocationFfss, NEXT_APPEARANCE_LOCATION_FFSS_FIELD_LENGTH],
    [localAuthorityCode, LOCAL_AUTHORITY_CODE_FIELD_LENGTH],
    [localAuthorityName, LOCAL_AUTHORITY_NAME_FIELD_LENGTH],
    [localAuthoritySecureUnitMarker, LOCAL_AUTHORITY_SECURE_UNIT_MARKER_FIELD_LENGTH],
    [socialWorkerName, SOCIAL_WORKER_NAME_FIELD_LENGTH],
    [socialWorkerTelephone, SOCIAL_WORKER_TELEPHONE_FIELD_LENGTH]
  ])

  return remSegment
}

export default remSegmentGenerator
