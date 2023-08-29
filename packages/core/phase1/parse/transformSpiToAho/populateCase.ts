import type { Case } from "../../../types/AnnotatedHearingOutcome"
import type { ResultedCaseMessageParsedXml } from "../../types/SpiResult"
import populateDefendant from "./populateDefendant"

export default (courtResult: ResultedCaseMessageParsedXml): Case => {
  const {
    Session: {
      Case: { PTIURN }
    }
  } = courtResult

  const ptiurn = PTIURN.toUpperCase()
  return {
    PTIURN: ptiurn,
    PreChargeDecisionIndicator: false,
    CourtReference: {
      MagistratesCourtReference: ptiurn
    },
    HearingDefendant: populateDefendant(courtResult)
  }
}
