import type { ArrestOffence } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import * as C from "../../../constants"
import { convertToPncDate, convertToPncTime } from "../helpers/convertToPncDateTime"
import { toApcoOffenceCode } from "../helpers/formatters"
import generateRow from "../helpers/generateRow"

const UNUSED = ""

const achSegmentGenerator = (offence: ArrestOffence): string => {
  const arrestOffenceNumber = String(offence.courtOffenceSequenceNumber)
  const apcoOffenceCode = toApcoOffenceCode(offence.npccOffenceCode)
  const cjsOffenceCode = offence.offenceCode.offenceCodeType === "cjs" ? offence.offenceCode.cjsOffenceCode : undefined
  const committedOnBail = offence.committedOnBail ? "y" : "n"
  const locationOfOffence = offence.locationText?.locationText
  const offenceLocationFSCode = offence.locationFsCode
  const offenceStartDate = convertToPncDate(offence.offenceStartDate)
  const offenceStartTime = offence.offenceStartTime ? convertToPncTime(offence.offenceStartTime) : undefined
  const offenceEndDate = offence.offenceEndDate ? convertToPncTime(offence.offenceEndDate) : undefined
  const offenceEndTime = offence.offenceEndTime ? convertToPncTime(offence.offenceEndTime) : undefined

  const achSegment = generateRow("ACH", [
    [UNUSED, C.CRIME_OFFENCE_REFERENCE_FIELD_LENGTH],
    [arrestOffenceNumber, C.ARREST_OFFENCE_NO_FIELD_LENGTH],
    [UNUSED, C.OFFENCE_QUALIFIER_FIELD_LENGTH],
    [apcoOffenceCode, C.ACPO_OFFENCE_CODE_FIELD_LENGTH],
    [UNUSED, C.OFFENCE_DESCRIPTION_FIELD_LENGTH],
    [cjsOffenceCode, C.CJS_OFFENCE_CODE_FIELD_LENGTH],
    [UNUSED, C.METHOD_USED_FIELD_LENGTH],
    [UNUSED, C.DRESS_FIELD_LENGTH],
    [committedOnBail, C.COMMITTED_ON_BAIL_FIELD_LENGTH],
    [locationOfOffence, C.OFFENCE_LOCATION_FIELD_LENGTH],
    [offenceLocationFSCode, C.OFFENCE_LOCATION_FS_CODE_FIELD_LENGTH],
    [offenceStartDate, C.OFFENCE_START_DATE_FIELD_LENGTH],
    [offenceStartTime, C.OFFENCE_START_TIME_FIELD_LENGTH],
    [offenceEndDate, C.OFFENCE_END_DATE_FIELD_LENGTH],
    [offenceEndTime, C.OFFENCE_END_TIME_FIELD_LENGTH]
  ])

  return achSegment
}

export default achSegmentGenerator
