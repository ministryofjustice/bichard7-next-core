import type { DisposalResult as AsnQueryResponseDisposalResult } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import type { DisposalResult as AddDisposalDisposalResult } from "@moj-bichard7/core/types/leds/DisposalRequest"
import * as CONSTANT from "../../../constants"

import { convertToPncDate } from "../helpers/convertToPncDateTime"
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

  const unitCode = unitMap[disposalDuration.units] ?? ""

  if (unitCode === "Y999") {
    return unitCode
  }

  return `${unitCode}${disposalDuration.count}`
}

const formateMonetaryValue = (value: number | undefined): string => {
  if (!value) {
    return ""
  }

  return value.toFixed(2).padStart(10, "0")
}

type Disposal = AsnQueryResponseDisposalResult | AddDisposalDisposalResult

const disSegmentGenerator = (disposal: Disposal): string | undefined => {
  if (!disposal) {
    return undefined
  }

  const type = disposal.disposalCode.toString()
  const qtyDuration = parseQtyDuration(disposal.disposalDuration)
  const qtyDate = disposal.disposalEffectiveDate && convertToPncDate(disposal.disposalEffectiveDate)
  const qtyMonetaryValue = formateMonetaryValue(disposal.disposalFine?.amount)
  const qtyUnitsFined = disposal.disposalFine?.units?.toString().padStart(2, "0") ?? CONSTANT.DEFAULT_QTY_UNITS
  const qualifiers = disposal.disposalQualifiers?.join("")
  const text = disposal.disposalText

  const disSegment = generateRow("DIS", [
    [CONSTANT.OFFENCE_UPDATE_TYPE, CONSTANT.UPDATE_TYPE_FIELD_LENGTH],
    [type, CONSTANT.DISPOSAL_TYPE_FIELD_LENGTH],
    [qtyDuration, CONSTANT.DISPOSAL_QTY_DURATION_FIELD_LENGTH],
    [qtyDate, CONSTANT.DISPOSAL_QTY_DATE_FIELD_LENGTH],
    [qtyMonetaryValue, CONSTANT.DISPOSAL_QTY_MONETARY_VALUE_FIELD_LENGTH],
    [qtyUnitsFined, CONSTANT.DISPOSAL_QTY_UNITS_FINED_FIELD_LENGTH],
    [qualifiers, CONSTANT.DISPOSAL_QUALIFIERS_FIELD_LENGTH],
    [text, CONSTANT.DISPOSAL_TEXT_FIELD_LENGTH]
  ])

  return disSegment
}

export default disSegmentGenerator
