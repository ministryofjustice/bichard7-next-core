import type { AhoXml } from "../../../types/AhoXml"
import type Exception from "../../../types/Exception"
import type { ExceptionPath } from "../../../types/Exception"
import Phase from "../../../types/Phase"
import hasError from "./hasError"

const addAhoErrors = (
  aho: AhoXml,
  exceptions: Exception[] | undefined,
  addFalseHasErrorAttributes = true,
  phase = Phase.HEARING_OUTCOME
) => {
  const hasAnyErrors =
    hasError(exceptions) || aho["br7:AnnotatedHearingOutcome"]?.["br7:HasError"]?.["#text"] === "true"

  if (aho["br7:AnnotatedHearingOutcome"]) {
    const hearingHasError = hasError(exceptions, ["AnnotatedHearingOutcome", "HearingOutcome", "Hearing"])
    if (hearingHasError || addFalseHasErrorAttributes) {
      aho["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"]["br7:Hearing"]["@_hasError"] = hearingHasError
    }

    aho["br7:AnnotatedHearingOutcome"] = {
      "br7:HearingOutcome": aho["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"],
      "br7:HasError": { "#text": hasAnyErrors.toString() },
      CXE01: aho["br7:AnnotatedHearingOutcome"].CXE01,
      "br7:PNCQueryDate": aho["br7:AnnotatedHearingOutcome"]["br7:PNCQueryDate"],
      "br7:PNCErrorMessage": aho["br7:AnnotatedHearingOutcome"]["br7:PNCErrorMessage"],
      "@_xmlns:br7": "http://schemas.cjse.gov.uk/datastandards/BR7/2007-12",
      "@_xmlns:ds": "http://schemas.cjse.gov.uk/datastandards/2006-10",
      "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
    }

    // we are deleting the key and re-adding it so we keep the order of the xmls tags correct
    delete aho["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"]["br7:Hearing"]["@_SchemaVersion"]
    aho["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"]["br7:Hearing"]["@_SchemaVersion"] = "4.0"

    const caseHasError = hasError(exceptions, ["AnnotatedHearingOutcome", "HearingOutcome", "Case"])
    if (caseHasError || addFalseHasErrorAttributes) {
      aho["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"]["br7:Case"]["@_hasError"] = caseHasError
    }

    delete aho["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"]["br7:Case"]["@_SchemaVersion"]
    aho["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"]["br7:Case"]["@_SchemaVersion"] = "4.0"

    const hearingDefendantHasError = hasError(exceptions, [
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant"
    ])
    if (hearingDefendantHasError || addFalseHasErrorAttributes) {
      aho["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"]["br7:Case"]["br7:HearingDefendant"]["@_hasError"] =
        hearingDefendantHasError
    }

    aho["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"]["br7:Case"]["br7:HearingDefendant"]["br7:Offence"] = aho[
      "br7:AnnotatedHearingOutcome"
    ]["br7:HearingOutcome"]["br7:Case"]["br7:HearingDefendant"]["br7:Offence"].map((offence, offenceIndex) => {
      const results = Array.isArray(offence["br7:Result"])
        ? offence["br7:Result"].map((result, resultIndex) => {
            delete result["@_SchemaVersion"]

            let resultHasErrorAttr = {}

            if (phase !== Phase.PNC_UPDATE || addFalseHasErrorAttributes) {
              resultHasErrorAttr = generateHasErrorAttribute(
                exceptions,
                [
                  "AnnotatedHearingOutcome",
                  "HearingOutcome",
                  "Case",
                  "HearingDefendant",
                  "Offence",
                  offenceIndex,
                  "Result",
                  resultIndex
                ],
                addFalseHasErrorAttributes
              )
            }

            return {
              ...result,
              ...resultHasErrorAttr,
              "@_SchemaVersion": "2.0"
            }
          })
        : offence["br7:Result"]

      delete offence["@_SchemaVersion"]

      const offenceHasErrorAttr = generateHasErrorAttribute(
        exceptions,
        ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Offence", offenceIndex],
        addFalseHasErrorAttributes
      )
      return {
        ...offence,
        "br7:Result": results,
        ...offenceHasErrorAttr,
        "@_SchemaVersion": "4.0"
      }
    })
  }
}

const generateHasErrorAttribute = (
  exceptions: Exception[] | undefined,
  path: ExceptionPath,
  addFalseHasErrorAttributes: boolean
) => {
  const elementHasError = hasError(exceptions, path)
  if (addFalseHasErrorAttributes) {
    return { "@_hasError": elementHasError }
  } else {
    return elementHasError ? { "@_hasError": true } : {}
  }
}

export default addAhoErrors
