import { readFileSync } from "fs"
import nunjucks from "nunjucks"

import type { SpiPlea } from "@moj-bichard7/common/types/Plea"
import type { SpiVerdict } from "../../../types/Verdict"

export type GenerateMessageOptions = {
  ASN?: string
  bailConditions?: string
  bailStatus?: string
  courtHearingLocation?: string
  courtPncIdentifier?: string
  offences: Offence[]
  person?: Person
  PTIURN?: string
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

type Offence = {
  code?: string
  convictionDate?: null | string
  endDate?: Date
  finding?: null | SpiVerdict
  location?: string
  modeOfTrial?: string
  offenceSequenceNumber?: number
  offenceWording?: string
  plea?: SpiPlea
  recordable?: boolean
  results: Result[]
  startDate?: Date
}

type Person = {
  title?: string
}

type Result = {
  bailStatus?: string
  code?: number
  nextHearing?: NextHearing
  qualifier?: string
  text?: string
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
