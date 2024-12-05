import type ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import { XMLParser } from "fast-xml-parser"

import type { Br7PncErrorMessageString } from "../../../types/AhoXml"
import type { Result } from "../../../types/AnnotatedHearingOutcome"
import type Exception from "../../../types/Exception"
import type { PncException } from "../../../types/Exception"

import { asnPath } from "../../../characterisation-tests/helpers/errorPaths"
import deduplicateExceptions from "../../exceptions/deduplicateExceptions"
import errorPaths from "../../exceptions/errorPaths"

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractPncExceptions = (aho: any): PncException[] => {
  const pncErrorMessagesFromAho =
    aho.AnnotatedHearingOutcome?.PNCErrorMessage ??
    aho.PNCUpdateDataset?.AnnotatedHearingOutcome?.PNCErrorMessage ??
    aho.AnnotatedPNCUpdateDataset?.PNCUpdateDataset?.AnnotatedHearingOutcome?.PNCErrorMessage

  if (pncErrorMessagesFromAho) {
    const pncErrorMessages: Br7PncErrorMessageString[] = Array.isArray(pncErrorMessagesFromAho)
      ? pncErrorMessagesFromAho
      : [pncErrorMessagesFromAho]

    return pncErrorMessages.map(
      (errorMessage: Br7PncErrorMessageString) =>
        ({
          code: errorMessage["@_classification"],
          path: errorPaths.case.asn,
          message: errorMessage["#text"]
        }) as PncException
    )
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
  let isAnnotatedPncUpdateDataset = false
  let isPncUpdateDataset = false

  if ("AnnotatedPNCUpdateDataset" in rawParsedObj) {
    aho = rawParsedObj.AnnotatedPNCUpdateDataset.PNCUpdateDataset.AnnotatedHearingOutcome
    isAnnotatedPncUpdateDataset = true
  } else if ("PNCUpdateDataset" in rawParsedObj) {
    aho = rawParsedObj.PNCUpdateDataset.AnnotatedHearingOutcome
    isPncUpdateDataset = true
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
  let pncExceptions = extractPncExceptions(rawParsedObj)

  if (isPncUpdateDataset) {
    pncExceptions = pncExceptions.map((pncException) => ({
      ...pncException,
      path: ["PNCUpdateDataset", ...pncException.path]
    }))
  }

  if (isAnnotatedPncUpdateDataset) {
    pncExceptions = pncExceptions.map((pncException) => ({
      ...pncException,
      path: ["AnnotatedPNCUpdateDataset", "PNCUpdateDataset", ...pncException.path]
    }))
  }

  // Remove the exception on the ASN element if it also appears in the PNC errors
  const asnException = mainExceptions.find((e) => e.path.join("|").endsWith(asnPath.join("|")))
  if (asnException) {
    const matchingPncException = pncExceptions.find((e) => e.code == asnException.code)
    if (matchingPncException) {
      mainExceptions = mainExceptions.filter((e) => e !== asnException)
    }
  }

  return mainExceptions.concat(pncExceptions)
}
