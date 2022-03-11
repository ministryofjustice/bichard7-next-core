import { readFileSync } from "fs"
import nunjucks from "nunjucks"
import type { SpiPlea } from "../../src/types/Plea"
import type { SpiVerdict } from "../../src/types/Verdict"

type Result = {
  code: number
  qualifier?: string
  text?: string
}

type Offence = {
  code?: string
  finding?: SpiVerdict
  results: Result[]
  recordable?: boolean
  plea?: SpiPlea
  startDate?: Date
  endDate?: Date
}

type Person = {
  title?: string
}

type GenerateMessageOptions = {
  offences: Offence[]
  PTIURN?: string
  courtHearingLocation?: string
  courtPncIdentifier?: string
  person?: Person
  bailConditions?: string
  bailStatus?: string
}

const padStart = function (str: string, maxLength: number, fillString?: string): string {
  return str.padStart(maxLength, fillString)
}

const formatDate = function (date: Date): string {
  return date.toISOString().split("T")[0]
}

export default (options: GenerateMessageOptions): string => {
  const template = readFileSync("test-data/input-message.xml.njk", "utf-8")

  return new nunjucks.Environment()
    .addFilter("padStart", padStart)
    .addFilter("formatDate", formatDate)
    .renderString(template, options)
}
