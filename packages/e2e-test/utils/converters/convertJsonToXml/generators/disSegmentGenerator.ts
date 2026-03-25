import type { DisposalResult } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import {
  DISPOSAL_QTY_DATE_FIELD_LENGTH,
  DISPOSAL_QTY_DURATION_FIELD_LENGTH,
  DISPOSAL_QTY_MONETARY_VALUE_FIELD_LENGTH,
  DISPOSAL_QTY_UNITS_FINED_FIELD_LENGTH,
  DISPOSAL_QUALIFIERS_FIELD_LENGTH,
  DISPOSAL_TEXT_FIELD_LENGTH,
  DISPOSAL_TYPE_FIELD_LENGTH,
  UPDATE_TYPE_FIELD_LENGTH
} from "../../../constants"
import { convertDate } from "../helpers/convertDate"
import generateRow from "../helpers/generateRow"

const unitMap: Record<string, string> = {
  days: "D",
  hours: "H",
  months: "M",
  weeks: "W",
  years: "Y",
  life: "Y999"
} as const

const parseQtyDuration = (disposalDuration: { count: number; units: string } | undefined): string => {
  if (!disposalDuration) {
    return ""
  }

  const unit = unitMap[disposalDuration.units] ?? ""
  const count = disposalDuration.count ? String(disposalDuration.count) : ""

  return `${unit}${count}`
}

const disSegmentGenerator = (updateType: string | undefined, disposal: DisposalResult): string | undefined => {
  if (!disposal) {
    return undefined
  }

  const type = disposal.disposalCode.toString()
  const qtyDuration = parseQtyDuration(disposal.disposalDuration)
  const qtyDate = disposal.disposalEffectiveDate && convertDate(disposal.disposalEffectiveDate)
  const qtyMonetaryValue = disposal.disposalFine?.amount?.toString()
  const qtyUnitsFined = disposal.disposalFine?.units?.toString()
  const qualifiers = disposal.disposalQualifiers?.join("")
  const text = disposal.disposalText

  const disSegment = generateRow("DIS", [
    [updateType, UPDATE_TYPE_FIELD_LENGTH],
    [type, DISPOSAL_TYPE_FIELD_LENGTH],
    [qtyDuration, DISPOSAL_QTY_DURATION_FIELD_LENGTH],
    [qtyDate, DISPOSAL_QTY_DATE_FIELD_LENGTH],
    [qtyMonetaryValue, DISPOSAL_QTY_MONETARY_VALUE_FIELD_LENGTH],
    [qtyUnitsFined, DISPOSAL_QTY_UNITS_FINED_FIELD_LENGTH],
    [qualifiers, DISPOSAL_QUALIFIERS_FIELD_LENGTH],
    [text, DISPOSAL_TEXT_FIELD_LENGTH]
  ])

  return disSegment
}

export default disSegmentGenerator
