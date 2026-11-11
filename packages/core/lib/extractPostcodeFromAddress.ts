import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

const UK_POSTCODE_REGEX = /^([A-Z]{1,2}\d[A-Z0-9]?)\s*(\d[A-Z]{2})$/i

export const validateAndNormalisePostcode = (value: string | undefined): null | string => {
  if (!value) {
    return null
  }

  const match = new RegExp(UK_POSTCODE_REGEX).exec(value.trim())

  if (!match) {
    return null
  }

  const [, outward, inward] = match
  return `${outward.toUpperCase()} ${inward.toUpperCase()}`
}

export const extractPostcodeFromAddress = (aho: AnnotatedHearingOutcome): null | string => {
  const address = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Address

  if (!address) {
    return null
  }

  const postcodeFromLine5 = validateAndNormalisePostcode(address.AddressLine5)
  if (postcodeFromLine5) {
    return postcodeFromLine5
  }

  const postcodeFromLine4 = validateAndNormalisePostcode(address.AddressLine4)
  if (postcodeFromLine4) {
    return postcodeFromLine4
  }

  const postcodeFromLine3 = validateAndNormalisePostcode(address.AddressLine3)
  if (postcodeFromLine3) {
    return postcodeFromLine3
  }

  return null
}
