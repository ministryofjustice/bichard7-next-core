import type { Case } from "src/types/HearingOutcome"
import type { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import { createElement } from "src/types/XmlElement"
import populateDefendant from "./populateDefendant"

export default (courtResult: ResultedCaseMessageParsedXml): Case => {
  const {
    Session: {
      Case: { PTIURN }
    }
  } = courtResult

  return {
    PTIURN: createElement(PTIURN?.toUpperCase()),
    PreChargeDecisionIndicator: createElement("N", { Literal: "No" }),
    CourtReference: {
      MagistratesCourtReference: createElement(PTIURN)
    },
    HearingDefendant: populateDefendant(courtResult)
  }
}
