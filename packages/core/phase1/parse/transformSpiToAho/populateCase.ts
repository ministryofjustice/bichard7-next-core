import type { ResultedCaseMessageParsedXml } from "phase1/types/SpiResult"
import type { Case } from "types/AnnotatedHearingOutcome"
import populateDefendant from "phase1/parse/transformSpiToAho/populateDefendant"

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
