import { readFileSync } from "fs"
import nunjucks from "nunjucks"

export enum Guilt {
  Guilty = "G",
  NotGuilty = "NG"
}

type Result = {
  code: number
  qualifier?: string
  text?: string
}

type Offence = {
  code?: string
  finding?: Guilt
  results: Result[]
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
