import type { PncDisposal } from "../../../types/PncQueryResult"
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

const createPncDisposal = (
  pncDisposalType: number | undefined,
  durationUnit: string | undefined,
  durationLength: number | undefined,
  secondaryDurationUnit: string | undefined,
  secondaryDurationLength: number | undefined,
  dateSpecifiedInResult: Date | undefined,
  amountSpecifiedInResult: number | undefined,
  resultQualifiers: string[] | undefined,
  disposalText: string | undefined,
  truncatedText: boolean | undefined
): PncDisposal => {
  const qtyDuration = durationUnit ? durationUnit + durationLength?.toString() : ""
  return {
    qtyDuration: qtyDuration,
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
    truncatedText,
    type: pncDisposalType
  }
}

const preProcessDisposalQuantity = (
  durationUnit: string | undefined,
  durationLength: number | undefined,
  pncDisposalType: number | undefined,
  dateSpecifiedInResult: Date | undefined,
  amountSpecifiedInResult: number | undefined
) => {
  let durationAndLength
  switch (durationUnit) {
    case DURATION_UNIT_LIFE:
      durationAndLength = PNC_REPRESENTATION_OF_LIFE
      break
    case DURATION_UNIT_SESSION:
    case "":
      durationAndLength = " ".repeat(4)
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
    resultQualifiers?.forEach((qualifier) => {
      if (INCLUDE_QUALIFIERS_LIST.includes(qualifier)) {
        disposalQualifier += qualifier.padEnd(2, " ")
      }
    })

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

  const qualifiers = disposalQualifier.trim()

  return qualifiers ? qualifiers.padEnd(2, " ") : ""
}

export default createPncDisposal
