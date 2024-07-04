import type { PncDisposal } from "../../../../../../types/PncQueryResult"

const DURATION_UNIT_LIFE = "L"
const DURATION_UNIT_SESSION = "S"
const PNC_REPRESENTATION_OF_LIFE = "Y999"
const NO_QUALIFIERS_LIST = [2059]
// prettier-ignore
const INCLUDE_QUALIFIERS_LIST = [
  "A",  "BA",  "BB",  "C",  "E",  "EF",  "F",  "FA",  "FB",  "FH",  "FX",  "FZ",  "GR",
  "GS",  "HA",  "HB", "HC",  "HD",  "K",  "Q",  "S",  "V",  "YU",  "YV",  "YW"
]
const NO_DISPOSAL_DATE_LIST = [2059, 3050, 3105]
const DISPOSAL_QUALIFIERS_FIELD_LENGTH = 12

const createPncDisposal = (
  pncDisposalType: number | undefined,
  durationUnit: string | undefined,
  durationLength: number | undefined,
  secondaryDurationUnit: string | undefined,
  secondaryDurationLength: number | undefined,
  dateSpecInResult: Date | undefined,
  amtSpecInResult: number | undefined,
  resultQualifiers: string[] | undefined,
  disposalText: string | undefined
): PncDisposal => {
  const qtyDuration = durationUnit ? durationUnit + durationLength?.toString() : ""
  return {
    qtyDuration: qtyDuration,
    qtyMonetaryValue: amtSpecInResult?.toString(),
    qtyDate: dateSpecInResult ? preProcessDate(dateSpecInResult) : "",
    qtyUnitsFined: preProcessDisposalQuantity(
      durationUnit,
      durationLength,
      pncDisposalType,
      dateSpecInResult,
      amtSpecInResult
    ),
    qualifiers: preProcessDisposalQualifiers(
      secondaryDurationUnit,
      secondaryDurationLength,
      resultQualifiers,
      pncDisposalType
    ),
    text: disposalText,
    type: pncDisposalType
  }
}

export const preProcessDate = (date: Date): string => {
  return date
    .toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
    .replace(/\//gm, "")
}

export const preProcessDisposalQuantity = (
  durationUnit: string | undefined,
  durationLength: number | undefined,
  pncDisposalType: number | undefined,
  dateSpecInResult: Date | undefined,
  amtSpecInResult: number | undefined
) => {
  let disposalQuantity = ""

  switch (durationUnit) {
    case DURATION_UNIT_LIFE:
      disposalQuantity += PNC_REPRESENTATION_OF_LIFE
      break
    case DURATION_UNIT_SESSION:
    case "":
      disposalQuantity += " ".repeat(4)
      break
    default:
      disposalQuantity += durationUnit || " "
      disposalQuantity += durationLength ? durationLength.toString().padEnd(3, " ") : " ".repeat(3)
  }

  if (dateSpecInResult && pncDisposalType && !NO_DISPOSAL_DATE_LIST.includes(pncDisposalType)) {
    disposalQuantity += preProcessDate(dateSpecInResult)
  } else {
    disposalQuantity += " ".repeat(8)
  }

  if (amtSpecInResult) {
    disposalQuantity += amtSpecInResult.toFixed(2).toString().padStart(10, "0")
  } else {
    disposalQuantity += "0".repeat(7) + ".00"
  }

  disposalQuantity += "00"

  return disposalQuantity
}

export const preProcessDisposalQualifiers = (
  secondaryDurationUnit: string | undefined,
  secondaryDurationLength: number | undefined,
  resultQualifiers: string[] | undefined,
  pncDisposalType: number | undefined
) => {
  let disposalQualifier = ""
  let secondaryDurationQualifier = ""

  if (secondaryDurationUnit === DURATION_UNIT_LIFE) {
    secondaryDurationQualifier = PNC_REPRESENTATION_OF_LIFE
  } else if (secondaryDurationUnit !== undefined && secondaryDurationLength !== undefined) {
    secondaryDurationQualifier = secondaryDurationUnit + secondaryDurationLength
  }

  if (pncDisposalType && !NO_QUALIFIERS_LIST.includes(pncDisposalType)) {
    let psQualifierFound = ""
    resultQualifiers?.forEach((qualifier) => {
      if (INCLUDE_QUALIFIERS_LIST.includes(qualifier)) {
        if (["P", "S"].includes(qualifier)) {
          psQualifierFound = qualifier
        } else {
          disposalQualifier += `${qualifier} `
        }
      }
    })

    if (psQualifierFound) {
      disposalQualifier += `${psQualifierFound} `
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

  return disposalQualifier.trim()
}

export default createPncDisposal
