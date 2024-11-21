import type ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import { XMLParser } from "fast-xml-parser"

import type { Result } from "../../../types/AnnotatedHearingOutcome"
import type Exception from "../../../types/Exception"
import type { PncException } from "../../../types/Exception"
import deduplicateExceptions from "../../exceptions/deduplicateExceptions"
import errorPaths from "../../exceptions/errorPaths"
import type { Br7PncErrorMessageString } from "../../../types/AhoXml"
import { asnPath } from "../../../characterisation-tests/helpers/errorPaths"

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractPncExceptions = (aho: any): PncException[] => {
  if (aho.AnnotatedHearingOutcome?.PNCErrorMessage) {
    const pncErrorMessages = Array.isArray(aho.AnnotatedHearingOutcome.PNCErrorMessage)
      ? aho.AnnotatedHearingOutcome.PNCErrorMessage
      : [aho.AnnotatedHearingOutcome.PNCErrorMessage]

    return pncErrorMessages.map((errorMessage: Br7PncErrorMessageString) => ({
      code: errorMessage["@_classification"],
      path: errorPaths.case.asn,
      message: errorMessage["#text"]
    }))
  }

  return []
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const extract = (el: any, path: (number | string)[] = []): Exception[] => {
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

  if ("AnnotatedPNCUpdateDataset" in rawParsedObj) {
    aho = rawParsedObj.AnnotatedPNCUpdateDataset.PNCUpdateDataset.AnnotatedHearingOutcome
  } else if ("PNCUpdateDataset" in rawParsedObj) {
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

  let mainExceptions = deduplicateExceptions(extract(rawParsedObj))
  const pncExceptions = extractPncExceptions(rawParsedObj)

  // Remove the exception on the ASN element if it also appears in the PNC errors
  const asnException = mainExceptions.find((e) => e.path.join("|") === asnPath.join("|"))
  if (asnException) {
    const matchingPncException = pncExceptions.find((e) => e.code == asnException.code)
    if (matchingPncException) {
      mainExceptions = mainExceptions.filter((e) => e !== asnException)
    }
  }

  return mainExceptions.concat(pncExceptions)
}
