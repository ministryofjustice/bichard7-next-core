import { XMLParser } from "fast-xml-parser"
import type { Result } from "src/types/AnnotatedHearingOutcome"
import type Exception from "src/types/Exception"

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const extract = (el: any, path: (string | number)[] = []): Exception[] => {
  const exceptions = []
  for (const key in el) {
    if (key === "@_Error") {
      if (typeof el[key] === "string") {
        exceptions.push({ code: el[key], path })
      }
    }
    if (typeof el[key] === "object") {
      const subExceptions = extract(el[key], path.concat([key.match(/\d+/) ? parseInt(key, 10) : key]))
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
  const offenceElem = rawParsedObj?.AnnotatedHearingOutcome?.HearingOutcome?.Case?.HearingDefendant?.Offence
  if (offenceElem && !Array.isArray(offenceElem)) {
    rawParsedObj.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [offenceElem]
  }
  const offenceArray = rawParsedObj?.AnnotatedHearingOutcome?.HearingOutcome?.Case?.HearingDefendant?.Offence
  if (offenceArray) {
    offenceArray.forEach((offence: any) => {
      const results = offence.Result
      if (results && !Array.isArray(results)) {
        offence.Result = [results]
      }
      offence.Result.forEach((result: Result) => {
        if (result.ResultQualifierVariable && !Array.isArray(result.ResultQualifierVariable)) {
          result.ResultQualifierVariable = [result.ResultQualifierVariable]
        }
        if (result.NumberSpecifiedInResult && !Array.isArray(result.NumberSpecifiedInResult)) {
          result.NumberSpecifiedInResult = [result.NumberSpecifiedInResult]
        }
      })
    })
  }
  return extract(rawParsedObj)
}
