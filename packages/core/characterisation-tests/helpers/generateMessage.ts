import { readFileSync } from "fs"
import nunjucks from "nunjucks"

const padStart = function (str: string, maxLength: number, fillString?: string): string {
  return str.padStart(maxLength, fillString)
}

const formatDate = function (date: Date): string {
  return date.toISOString().split("T")[0]
}

const generateMessage = (templateFile: string, options: Record<string, unknown>): string => {
  const template = readFileSync(templateFile, "utf-8")

  return new nunjucks.Environment()
    .addFilter("padStart", padStart)
    .addFilter("formatDate", formatDate)
    .renderString(template, options)
}

export default generateMessage
