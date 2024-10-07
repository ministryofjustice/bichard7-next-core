import type ExceptionCode from "bichard7-next-data-latest/types/ExceptionCode"
import { XMLParser } from "fast-xml-parser"
import type { AnnotatedHearingOutcome, Result } from "../../types/AnnotatedHearingOutcome"
import type AnnotatedPncUpdateDataset from "../../types/AnnotatedPncUpdateDataset"
import type Exception from "../../types/Exception"

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const extract = (el: any, path: (string | number)[] = []): Exception[] => {
  const exceptions = []
  for (const key in el) {
    if (key === "@_Error") {
      if (typeof el[key] === "string") {
        exceptions.push({ code: el[key] as ExceptionCode, path })
      }
    }

    if (typeof el[key] === "object") {
      const subExceptions = extract(el[key], path.concat([key.match(/\d+/) ? parseInt(key, 10) : key]))
      subExceptions.forEach((e) => exceptions.push(e))
    }
  }

  return exceptions
}

const extractExceptionsFromAho = <OutputMessage extends AnnotatedHearingOutcome | AnnotatedPncUpdateDataset>(
  xml: string
): Exception[] => {
  const options = {
    ignoreAttributes: false,
    removeNSPrefix: true
  }
  const parser = new XMLParser(options)
  const rawParsedOutputMessage = parser.parse(xml) as OutputMessage
  const annotatedHearingOutcome: AnnotatedHearingOutcome =
    "AnnotatedPNCUpdateDataset" in rawParsedOutputMessage
      ? rawParsedOutputMessage.AnnotatedPNCUpdateDataset.PNCUpdateDataset
      : rawParsedOutputMessage

  const hearingOutcome = annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome

  const offenceElem = hearingOutcome.Case?.HearingDefendant?.Offence
  if (offenceElem && !Array.isArray(offenceElem)) {
    hearingOutcome.Case.HearingDefendant.Offence = [offenceElem]
  }

  const offenceArray = hearingOutcome.Case?.HearingDefendant?.Offence
  if (offenceArray) {
    offenceArray.forEach((offence) => {
      const results = offence.Result
      if (results && !Array.isArray(results)) {
        offence.Result = [results]
        offence.Result.forEach((result: Result) => {
          if (result.ResultQualifierVariable && !Array.isArray(result.ResultQualifierVariable)) {
            result.ResultQualifierVariable = [result.ResultQualifierVariable]
          }
        })
      }
    })
  }

  return extract(annotatedHearingOutcome)
}

export default extractExceptionsFromAho
