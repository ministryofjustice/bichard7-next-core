import type { OrganisationUnitCodes } from "../../types/AnnotatedHearingOutcome"
import Asn from "../lib/Asn"
import isOrganisationUnitValid from "../lib/isOrganisationUnitValid"

const convertAsnToOrganisationUnit = (asn: string): OrganisationUnitCodes => {
  let topLevelCode = ""
  let offset = 1
  if (asn.length == 21) {
    topLevelCode = asn.substring(2, 3).toUpperCase()
    offset = 0
  }

  return {
    ...(topLevelCode ? { TopLevelCode: topLevelCode } : {}),
    SecondLevelCode: asn.substring(3 - offset, 5 - offset).toUpperCase(),
    ThirdLevelCode: asn.substring(5 - offset, 7 - offset).toUpperCase(),
    BottomLevelCode: asn.substring(7 - offset, 9 - offset).toUpperCase()
  } as OrganisationUnitCodes
}

export const isAsnFormatValid = (asn: string): boolean => {
  const validFormat = /^[0-9]{2}[A-Z0-9]{6,7}[0-9]{11}[A-HJ-NP-RT-Z]{1}$/.test(asn)
  const validCheckDigit = new Asn(asn).checkCharacter() === asn.slice(-1)
  return validFormat && validCheckDigit
}

export const isAsnOrganisationUnitValid = (asn: string): boolean =>
  isOrganisationUnitValid(convertAsnToOrganisationUnit(asn))

const isAsnValid = (asn?: string): boolean => {
  if (!asn) {
    return false
  }

  return isAsnFormatValid(asn) && isAsnOrganisationUnitValid(asn)
}

export default isAsnValid
