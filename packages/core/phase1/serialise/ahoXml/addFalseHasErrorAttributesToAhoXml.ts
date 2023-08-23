import type { AhoXml } from "phase1/types/AhoXml"

// Sometimes, when generating the "updated XML" for the database, we include hasError elements
const addFalseHasErrorAttributesToAhoXml = (aho: AhoXml): void | Error => {
  if (aho["br7:HearingOutcome"]) {
    aho["br7:HearingOutcome"]["br7:Hearing"]["@_hasError"] = false
    delete aho["br7:HearingOutcome"]["br7:Hearing"]["@_SchemaVersion"]
    aho["br7:HearingOutcome"]["br7:Hearing"]["@_SchemaVersion"] = "4.0"

    aho["br7:HearingOutcome"]["br7:Case"]["@_hasError"] = false
    delete aho["br7:HearingOutcome"]["br7:Case"]["@_SchemaVersion"]
    aho["br7:HearingOutcome"]["br7:Case"]["@_SchemaVersion"] = "4.0"

    aho["br7:HearingOutcome"]["br7:Case"]["br7:HearingDefendant"]["@_hasError"] = false

    aho["br7:HearingOutcome"]["br7:Case"]["br7:HearingDefendant"]["br7:Offence"].forEach((offence) => {
      offence["@_hasError"] = false
      delete offence["@_SchemaVersion"]
      offence["@_SchemaVersion"] = "4.0"

      if (Array.isArray(offence["br7:Result"])) {
        offence["br7:Result"].forEach((result) => {
          result["@_hasError"] = false
          delete result["@_SchemaVersion"]
          result["@_SchemaVersion"] = "2.0"
        })
      } else {
        offence["br7:Result"]["@_hasError"] = false
        delete offence["br7:Result"]["@_SchemaVersion"]
        offence["br7:Result"]["@_SchemaVersion"] = "2.0"
      }
    })
  }
}

export default addFalseHasErrorAttributesToAhoXml
