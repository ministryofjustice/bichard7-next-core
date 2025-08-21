import type { Case } from "../../../types/AnnotatedHearingOutcome"
import type { ResultedCaseMessageParsedXml } from "../../../types/SpiResult"

import populateDefendant from "./populateDefendant"

export default (courtResult: ResultedCaseMessageParsedXml): Case => {
  const {
    Session: {
      Case: { PTIURN }
    }
  } = courtResult

  const ptiurn = PTIURN.toUpperCase()
  return {
    CourtReference: {
      MagistratesCourtReference: ptiurn
    },
    HearingDefendant: populateDefendant(courtResult),
    PreChargeDecisionIndicator: false,
    PTIURN: ptiurn
  }
}
