import type { ArrestOffence } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import * as CONSTANT from "../../../constants"
import { convertToPncDate, convertToPncTime } from "../helpers/convertToPncDateTime"
import { toApcoOffenceCode } from "../helpers/formatters"
import generateRow from "../helpers/generateRow"

const UNUSED = ""

const achSegmentGenerator = (offence: ArrestOffence): string => {
  const arrestOffenceNumber = offence.courtOffenceSequenceNumber
    ? String(offence.courtOffenceSequenceNumber)
    : undefined
  const apcoOffenceCode = toApcoOffenceCode(offence.npccOffenceCode)
  const cjsOffenceCode = offence.offenceCode.offenceCodeType === "cjs" ? offence.offenceCode.cjsOffenceCode : undefined
  const locationOfOffence = offence.locationText?.locationText
  const committedOnBail = offence.committedOnBail ? "Y" : "N"
  const offenceLocationFSCode = offence.locationFsCode
  const offenceStartDate = convertToPncDate(offence.offenceStartDate)
  const offenceStartTime = offence.offenceStartTime ? convertToPncTime(offence.offenceStartTime) : undefined
  const offenceEndDate = offence.offenceEndDate ? convertToPncDate(offence.offenceEndDate) : undefined
  const offenceEndTime = offence.offenceEndTime ? convertToPncTime(offence.offenceEndTime) : undefined

  const achSegment = generateRow("ACH", [
    [CONSTANT.OFFENCE_UPDATE_TYPE, CONSTANT.UPDATE_TYPE_FIELD_LENGTH],
    [UNUSED, CONSTANT.CRIME_OFFENCE_REFERENCE_FIELD_LENGTH],
    [arrestOffenceNumber, CONSTANT.ARREST_OFFENCE_NO_FIELD_LENGTH],
    [UNUSED, CONSTANT.OFFENCE_QUALIFIER_FIELD_LENGTH],
    [apcoOffenceCode, CONSTANT.ACPO_OFFENCE_CODE_FIELD_LENGTH],
    [UNUSED, CONSTANT.OFFENCE_DESCRIPTION_FIELD_LENGTH],
    [cjsOffenceCode, CONSTANT.CJS_OFFENCE_CODE_FIELD_LENGTH],
    [UNUSED, CONSTANT.METHOD_USED_FIELD_LENGTH],
    [UNUSED, CONSTANT.DRESS_FIELD_LENGTH],
    [committedOnBail, CONSTANT.COMMITTED_ON_BAIL_FIELD_LENGTH],
    [locationOfOffence, CONSTANT.OFFENCE_LOCATION_FIELD_LENGTH],
    [offenceLocationFSCode, CONSTANT.OFFENCE_LOCATION_FS_CODE_FIELD_LENGTH],
    [offenceStartDate, CONSTANT.OFFENCE_START_DATE_FIELD_LENGTH],
    [offenceStartTime, CONSTANT.OFFENCE_START_TIME_FIELD_LENGTH],
    [offenceEndDate, CONSTANT.OFFENCE_END_DATE_FIELD_LENGTH],
    [offenceEndTime, CONSTANT.OFFENCE_END_TIME_FIELD_LENGTH]
  ])

  return achSegment
}

export default achSegmentGenerator
