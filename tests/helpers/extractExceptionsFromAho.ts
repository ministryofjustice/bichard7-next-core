import type Exception from "../../src/types/Exception"
import { XMLParser } from "fast-xml-parser"

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const extract = (el: any, path: string[] = []): Exception[] => {
  const exceptions = []
  for (const key in el) {
    if (key === "@_Error") {
      if (typeof el[key] === "string") {
        exceptions.push({ code: el[key], path })
      }
    }
    if (typeof el[key] === "object") {
      const subExceptions = extract(el[key], path.concat([key]))
      subExceptions.forEach((e) => exceptions.push(e))
    }
  }
  return exceptions
}

export default (xml: string): Exception[] => {
  const options = {
    ignoreAttributes: false,
    removeNSPrefix: true
  }
  const parser = new XMLParser(options)
  const rawParsedObj = parser.parse(xml)
  return extract(rawParsedObj)
}
