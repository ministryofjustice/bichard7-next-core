import type { SpiPlea } from "@moj-bichard7/common/types/Plea"

import type { SpiVerdict } from "../../types/Verdict"

import generateMessage from "./generateMessage"

export type Address = {
  addressLine1?: string
  addressLine2?: string
  addressLine3?: string
  addressLine4?: string
  addressLine5?: string
  postcode?: string
}

export type AlcoholLevel = {
  amount: number
  method?: string
}

export type GenerateSpiMessageOptions = {
  ASN?: string
  bailConditions?: string
  bailStatus?: string
  courtHearingLocation?: string
  courtPncIdentifier?: string
  offences: Offence[]
  organisation?: Organisation
  person?: Person
  psaCode?: number
  PTIURN?: string
  reasonForBailConditionsOrCustody?: string
  timeOfHearing?: string
}

export type Offence = {
  alcoholLevel?: AlcoholLevel
  code?: string
  convictionDate?: null | string
  endDate?: Date
  endTime?: string
  finding?: null | SpiVerdict
  location?: string
  modeOfTrial?: string
  offenceDateCode?: number
  offenceSequenceNumber?: number
  offenceWording?: string
  plea?: SpiPlea
  recordable?: boolean
  results: Result[]
  startDate?: Date
  startTime?: string
}

export type Result = {
  bailStatus?: string
  code?: number
  nextHearing?: NextHearing
  outcome?: {
    amountSterling?: number
    duration?: {
      unit?: string
      value?: number
    }
    penaltyPoints?: number
  }
  qualifier?: string
  resultQualifierCode?: string
  text?: string
}

type NextHearing = {
  bailStatusOffence?: string
  nextHearingDetails?: NextHearingDetails
  nextHearingReason?: string
}

type NextHearingDetails = {
  courtHearingLocation?: string
  dateOfHearing?: string
  timeOfHearing?: string
}

type Organisation = {
  name?: string
}

type Person = {
  address?: Address
  familyName?: string
  givenName1?: string
  givenName2?: string
  givenName3?: string
  title?: string
}

const generateSpiMessage = (options: GenerateSpiMessageOptions) =>
  generateMessage("test-data/SpiResults.xml.njk", options)

export default generateSpiMessage
