import type { Offence } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import * as CONSTANT from "../../../constants"
import { convertToPncDate, convertToPncTime } from "../helpers/convertToPncDateTime"
import { toApcoOffenceCode } from "../helpers/formatters"
import generateRow from "../helpers/generateRow"

const cofSegmentGenerator = (offence: Offence): string => {
  const referenceNumber = String(offence.courtOffenceSequenceNumber).padStart(3, "0")
  const offenceQualifier1 = offence.roleQualifiers?.join("")
  const offenceQualifier2 = offence.legislationQualifiers?.join("")
  const acpoOffenceCode = toApcoOffenceCode(offence.npccOffenceCode)
  const cjsOffenceCode = offence.cjsOffenceCode
  const offenceStartDate = convertToPncDate(offence.offenceStartDate)
  const offenceStartTime = offence.offenceStartTime && convertToPncTime(offence.offenceStartTime)
  const offenceEndDate = offence.offenceEndDate && convertToPncDate(offence.offenceEndDate)
  const offenceEndTim = offence.offenceEndTime && convertToPncTime(offence.offenceEndTime)

  const cofSegment = generateRow("COF", [
    [CONSTANT.UPDATE_TYPE, CONSTANT.UPDATE_TYPE_FIELD_LENGTH],
    [referenceNumber, CONSTANT.REFERENCE_NUMBER_FIELD_LENGTH],
    [offenceQualifier1, CONSTANT.OFFENCE_QUALIFIER1_FIELD_LENGTH],
    [offenceQualifier2, CONSTANT.OFFENCE_QUALIFIER2_FIELD_LENGTH],
    [acpoOffenceCode, CONSTANT.ACPO_OFFENCE_CODE_FIELD_LENGTH],
    [cjsOffenceCode, CONSTANT.CJS_OFFENCE_CODE_FIELD_LENGTH],
    [offenceStartDate, CONSTANT.OFFENCE_START_DATE_FIELD_LENGTH],
    [offenceStartTime, CONSTANT.OFFENCE_START_TIME_FIELD_LENGTH],
    [offenceEndDate, CONSTANT.OFFENCE_END_DATE_FIELD_LENGTH],
    [offenceEndTim, CONSTANT.OFFENCE_END_TIME_FIELD_LENGTH]
  ])

  return cofSegment
}

export default cofSegmentGenerator
