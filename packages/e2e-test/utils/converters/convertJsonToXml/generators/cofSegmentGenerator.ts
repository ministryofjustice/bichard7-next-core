import type { Offence } from "@moj-bichard7/core/types/leds/AsnQueryResponse"

import {
  ACPO_OFFENCE_CODE_FIELD_LENGTH,
  CJS_OFFENCE_CODE_FIELD_LENGTH,
  OFFENCE_END_DATE_FIELD_LENGTH,
  OFFENCE_END_TIME_FIELD_LENGTH,
  OFFENCE_QUALIFIER1_FIELD_LENGTH,
  OFFENCE_QUALIFIER2_FIELD_LENGTH,
  OFFENCE_START_DATE_FIELD_LENGTH,
  OFFENCE_START_TIME_FIELD_LENGTH,
  REFERENCE_NUMBER_FIELD_LENGTH,
  UPDATE_TYPE,
  UPDATE_TYPE_FIELD_LENGTH
} from "../../../constants"
import { convertToPncDate } from "../helpers/convertToPncDate"
import { convertToPncTime } from "../helpers/convertToPncTime"
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
    [UPDATE_TYPE, UPDATE_TYPE_FIELD_LENGTH],
    [referenceNumber, REFERENCE_NUMBER_FIELD_LENGTH],
    [offenceQualifier1, OFFENCE_QUALIFIER1_FIELD_LENGTH],
    [offenceQualifier2, OFFENCE_QUALIFIER2_FIELD_LENGTH],
    [acpoOffenceCode, ACPO_OFFENCE_CODE_FIELD_LENGTH],
    [cjsOffenceCode, CJS_OFFENCE_CODE_FIELD_LENGTH],
    [offenceStartDate, OFFENCE_START_DATE_FIELD_LENGTH],
    [offenceStartTime, OFFENCE_START_TIME_FIELD_LENGTH],
    [offenceEndDate, OFFENCE_END_DATE_FIELD_LENGTH],
    [offenceEndTim, OFFENCE_END_TIME_FIELD_LENGTH]
  ])

  return cofSegment
}

export default cofSegmentGenerator
