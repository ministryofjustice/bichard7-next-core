import { XMLParser } from "fast-xml-parser"
import type { Result } from "../../../types/AnnotatedHearingOutcome"
import type ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import deduplicateExceptions from "../../exceptions/deduplicateExceptions"
import errorPaths from "../../lib/errorPaths"
import type Exception from "../../types/Exception"

// TODO: Use the existing AHO XML parsing to pull out the errors
//eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractPncExceptions = (aho: any): Exception[] => {
  const errorMessage = aho.AnnotatedHearingOutcome?.PNCErrorMessage?.["@_classification"]

  return errorMessage ? [{ code: errorMessage, path: errorPaths.case.asn }] : []
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const extract = (el: any, path: (string | number)[] = []): Exception[] => {
  const exceptions: Exception[] = []
  for (const key in el) {
    if (key === "@_Error") {
      if (typeof el[key] === "string") {
        exceptions.push({ code: el[key] as ExceptionCode, path })
      }
    }

    if (typeof el[key] === "object") {
      const re = /\d+/
      const match = re.exec(key)
      const subExceptions = extract(el[key], path.concat([match ? parseInt(key, 10) : key]))
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

  let aho

  if ("PNCUpdateDataset" in rawParsedObj) {
    aho = rawParsedObj.PNCUpdateDataset.AnnotatedHearingOutcome
  } else if ("AnnotatedHearingOutcome" in rawParsedObj) {
    aho = rawParsedObj.AnnotatedHearingOutcome
  }

  const offenceElem = aho?.HearingOutcome?.Case?.HearingDefendant?.Offence
  if (offenceElem && !Array.isArray(offenceElem)) {
    aho.HearingOutcome.Case.HearingDefendant.Offence = [offenceElem]
  }

  const offenceArray = aho?.HearingOutcome?.Case?.HearingDefendant?.Offence
  if (offenceArray) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        if (result.AmountSpecifiedInResult && !Array.isArray(result.AmountSpecifiedInResult)) {
          result.AmountSpecifiedInResult = [result.AmountSpecifiedInResult]
        }
      })
    })
  }

  const mainExceptions = extract(rawParsedObj)
  const pncExceptions = extractPncExceptions(rawParsedObj)
  return deduplicateExceptions(mainExceptions.concat(pncExceptions))
}
