import type { PoliceDisposal } from "@moj-bichard7/common/types/PoliceQueryResult"

import formatDateSpecifiedInResult from "./formatDateSpecifiedInResult"

const DURATION_UNIT_LIFE = "L"
const DURATION_UNIT_SESSION = "S"
const PNC_REPRESENTATION_OF_LIFE = "Y999"
const NO_QUALIFIERS_LIST = [2059]
// prettier-ignore
const INCLUDE_QUALIFIERS_LIST = [
  "A",  "BA",  "BB",  "C",  "E",  "EF",  "F",  "FA",  "FB",  "FH",  "FX",  "FZ",  "GR",
  "GS",  "HA",  "HB", "HC",  "HD",  "K",  "Q",  "V",  "YU",  "YV",  "YW"
]
const NO_DISPOSAL_DATE_LIST = [2059, 3050, 3105]
const DISPOSAL_QUALIFIERS_FIELD_LENGTH = 12

type CreatePoliceDisposalRequest = {
  amountSpecifiedInResult?: number
  dateSpecifiedInResult?: Date
  disposalText?: string
  durationLength?: number
  durationUnit?: string
  pncDisposalType?: number
  resultQualifiers?: string[]
  secondaryDurationLength?: number
  secondaryDurationUnit?: string
}

const createPoliceDisposal = ({
  amountSpecifiedInResult,
  dateSpecifiedInResult,
  disposalText,
  durationLength,
  durationUnit,
  pncDisposalType,
  resultQualifiers,
  secondaryDurationLength,
  secondaryDurationUnit
}: CreatePoliceDisposalRequest): PoliceDisposal => ({
  qtyDuration: durationUnit ? durationUnit + durationLength?.toString() : "",
  qtyMonetaryValue: amountSpecifiedInResult?.toString(),
  qtyDate: dateSpecifiedInResult ? formatDateSpecifiedInResult(dateSpecifiedInResult, true) : "",
  qtyUnitsFined: preProcessDisposalQuantity(
    durationUnit,
    durationLength,
    pncDisposalType,
    dateSpecifiedInResult,
    amountSpecifiedInResult
  ),
  qualifiers: preProcessDisposalQualifiers(
    secondaryDurationUnit,
    secondaryDurationLength,
    resultQualifiers,
    pncDisposalType
  ),
  text: disposalText,
  type: pncDisposalType
})

const preProcessDisposalQuantity = (
  durationUnit: string | undefined,
  durationLength: number | undefined,
  pncDisposalType: number | undefined,
  dateSpecifiedInResult: Date | undefined,
  amountSpecifiedInResult: number | undefined
) => {
  let durationAndLength
  switch (durationUnit) {
    case "":
    case DURATION_UNIT_SESSION:
      durationAndLength = " ".repeat(4)
      break
    case DURATION_UNIT_LIFE:
      durationAndLength = PNC_REPRESENTATION_OF_LIFE
      break
    default:
      const length = durationLength ? durationLength.toString().padEnd(3, " ") : " ".repeat(3)
      durationAndLength = (durationUnit || " ") + length
  }

  const hasDate = dateSpecifiedInResult && pncDisposalType && !NO_DISPOSAL_DATE_LIST.includes(pncDisposalType)
  const date = hasDate ? formatDateSpecifiedInResult(dateSpecifiedInResult, true) : " ".repeat(8)

  const amount = amountSpecifiedInResult
    ? amountSpecifiedInResult.toFixed(2).toString().padStart(10, "0")
    : " ".repeat(10)

  return durationAndLength + date + amount + "00"
}

const preProcessDisposalQualifiers = (
  secondaryDurationUnit: string | undefined,
  secondaryDurationLength: number | undefined,
  resultQualifiers: string[] | undefined,
  pncDisposalType: number | undefined
) => {
  let secondaryDurationQualifier = ""
  if (secondaryDurationUnit === DURATION_UNIT_LIFE) {
    secondaryDurationQualifier = PNC_REPRESENTATION_OF_LIFE
  } else if (secondaryDurationUnit && secondaryDurationLength) {
    secondaryDurationQualifier = secondaryDurationUnit + secondaryDurationLength
  }

  let disposalQualifier = ""
  if (pncDisposalType && !NO_QUALIFIERS_LIST.includes(pncDisposalType)) {
    const includedQualifiers = resultQualifiers
      ?.filter((qualifier) => INCLUDE_QUALIFIERS_LIST.includes(qualifier))
      .reduce((includedQualifiers, qualifier) => includedQualifiers + qualifier.padEnd(2, " "), "")

    disposalQualifier += includedQualifiers ?? ""

    const hasSQualifier = resultQualifiers?.some((qualifier) => "S" == qualifier)
    if (hasSQualifier) {
      disposalQualifier += "S"
    }

    if (secondaryDurationQualifier && disposalQualifier.length <= DISPOSAL_QUALIFIERS_FIELD_LENGTH - 6) {
      disposalQualifier += "S "
    }
  }

  if (secondaryDurationQualifier) {
    disposalQualifier +=
      " ".repeat(Math.max(0, DISPOSAL_QUALIFIERS_FIELD_LENGTH - 4 - disposalQualifier.length)) +
      secondaryDurationQualifier
  }

  return disposalQualifier
}

export default createPoliceDisposal
