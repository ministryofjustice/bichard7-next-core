import { readFileSync } from "fs"
import nunjucks from "nunjucks"

type Offence = {
  resultCodes: number[]
  recordable?: boolean
}

type GenerateMessageOptions = {
  offences: Offence[]
}

const padStart = function (str: string, maxLength: number, fillString?: string) {
  return str.padStart(maxLength, fillString)
}

export default (options: GenerateMessageOptions): string => {
  const template = readFileSync("test-data/input-message.xml.njk", "utf-8")

  return new nunjucks.Environment().addFilter("padStart", padStart).renderString(template, options)
}
