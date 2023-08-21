import { readFileSync } from "fs"
import nunjucks from "nunjucks"
import type { SpiPlea } from "phase1/types/Plea"
import type { SpiVerdict } from "phase1/types/Verdict"

type NextHearingDetails = {
  courtHearingLocation?: string
  dateOfHearing?: string
  timeOfHearing?: string
}

type NextHearing = {
  nextHearingDetails?: NextHearingDetails
  nextHearingReason?: string
  bailStatusOffence?: string
}

type Result = {
  code?: number
  qualifier?: string
  text?: string
  bailStatus?: string
  nextHearing?: NextHearing
}

type Offence = {
  code?: string
  finding?: SpiVerdict | null
  results: Result[]
  recordable?: boolean
  plea?: SpiPlea
  startDate?: Date
  endDate?: Date
  modeOfTrial?: string
  location?: string
  offenceWording?: string
  offenceSequenceNumber?: number
  convictionDate?: string | null
}

type Person = {
  title?: string
}

export type GenerateMessageOptions = {
  offences: Offence[]
  PTIURN?: string
  courtHearingLocation?: string
  courtPncIdentifier?: string
  person?: Person
  bailConditions?: string
  bailStatus?: string
  ASN?: string
}

const padStart = function (str: string, maxLength: number, fillString?: string): string {
  return str.padStart(maxLength, fillString)
}

const formatDate = function (date: Date): string {
  return date.toISOString().split("T")[0]
}

export default (options: GenerateMessageOptions): string => {
  const template = readFileSync("phase1/tests/fixtures/input-message.xml.njk", "utf-8")

  return new nunjucks.Environment()
    .addFilter("padStart", padStart)
    .addFilter("formatDate", formatDate)
    .renderString(template, options)
}
