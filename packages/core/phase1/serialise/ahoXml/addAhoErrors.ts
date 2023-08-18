import type { AhoXml } from "../../types/AhoXml"
import type Exception from "../../types/Exception"
import hasError from "./hasError"

const addAhoErrors = (aho: AhoXml, exceptions: Exception[] | undefined) => {
  if (aho["br7:AnnotatedHearingOutcome"]) {
    aho["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"]["br7:Hearing"]["@_hasError"] = hasError(exceptions, [
      "types/AnnotatedHearingOutcome",
      "HearingOutcome",
      "Hearing"
    ])

    aho["br7:AnnotatedHearingOutcome"] = {
      "br7:HearingOutcome": aho["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"],
      "br7:HasError": hasError(exceptions),
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

    aho["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"]["br7:Case"]["@_hasError"] = hasError(exceptions, [
      "types/AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case"
    ])

    delete aho["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"]["br7:Case"]["@_SchemaVersion"]
    aho["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"]["br7:Case"]["@_SchemaVersion"] = "4.0"

    aho["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"]["br7:Case"]["br7:HearingDefendant"]["@_hasError"] =
      hasError(exceptions, ["types/AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant"])

    aho["br7:AnnotatedHearingOutcome"]["br7:HearingOutcome"]["br7:Case"]["br7:HearingDefendant"]["br7:Offence"] = aho[
      "br7:AnnotatedHearingOutcome"
    ]["br7:HearingOutcome"]["br7:Case"]["br7:HearingDefendant"]["br7:Offence"].map((offence, offenceIndex) => {
      const results = Array.isArray(offence["br7:Result"])
        ? offence["br7:Result"].map((result, resultIndex) => {
            delete result["@_SchemaVersion"]

            return {
              ...result,
              "@_hasError": hasError(exceptions, [
                "types/AnnotatedHearingOutcome",
                "HearingOutcome",
                "Case",
                "HearingDefendant",
                "Offence",
                offenceIndex,
                "Result",
                resultIndex
              ]),
              "@_SchemaVersion": "2.0"
            }
          })
        : offence["br7:Result"]

      delete offence["@_SchemaVersion"]

      return {
        ...offence,
        "br7:Result": results,
        "@_hasError": hasError(exceptions, [
          "types/AnnotatedHearingOutcome",
          "HearingOutcome",
          "Case",
          "HearingDefendant",
          "Offence",
          offenceIndex
        ]),
        "@_SchemaVersion": "4.0"
      }
    })
  }
}

export default addAhoErrors
