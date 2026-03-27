import type { Offence } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import * as C from "../../../constants"
import { convertToPncDate, convertToPncTime } from "../helpers/convertToPncDateTime"
import generateRow from "../helpers/generateRow"

const convertToApcoOffenceCode = (npccOffenceCode: string | undefined) => npccOffenceCode?.replace(/\./g, ":")

const cofSegmentGenerator = (offence: Offence): string => {
  const referenceNumber = String(offence.courtOffenceSequenceNumber).padStart(3, "0")
  const offenceQualifier1 = offence.roleQualifiers?.join("")
  const offenceQualifier2 = offence.legislationQualifiers?.join("")
  const acpoOffenceCode = convertToApcoOffenceCode(offence.npccOffenceCode)
  const cjsOffenceCode = offence.cjsOffenceCode
  const offenceStartDate = convertToPncDate(offence.offenceStartDate)
  const offenceStartTime = offence.offenceStartTime && convertToPncTime(offence.offenceStartTime)
  const offenceEndDate = offence.offenceEndDate && convertToPncDate(offence.offenceEndDate)
  const offenceEndTim = offence.offenceEndTime && convertToPncTime(offence.offenceEndTime)

  const cofSegment = generateRow("COF", [
    [C.UPDATE_TYPE, C.UPDATE_TYPE_FIELD_LENGTH],
    [referenceNumber, C.REFERENCE_NUMBER_FIELD_LENGTH],
    [offenceQualifier1, C.OFFENCE_QUALIFIER1_FIELD_LENGTH],
    [offenceQualifier2, C.OFFENCE_QUALIFIER2_FIELD_LENGTH],
    [acpoOffenceCode, C.ACPO_OFFENCE_CODE_FIELD_LENGTH],
    [cjsOffenceCode, C.CJS_OFFENCE_CODE_FIELD_LENGTH],
    [offenceStartDate, C.OFFENCE_START_DATE_FIELD_LENGTH],
    [offenceStartTime, C.OFFENCE_START_TIME_FIELD_LENGTH],
    [offenceEndDate, C.OFFENCE_END_DATE_FIELD_LENGTH],
    [offenceEndTim, C.OFFENCE_END_TIME_FIELD_LENGTH]
  ])

  return cofSegment
}

export default cofSegmentGenerator
