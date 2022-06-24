import type { Case } from "src/types/AnnotatedHearingOutcome"
import type { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
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
    HearingDefendant: populateDefendant(courtResult),
    ForceOwner: {
      SecondLevelCode: ptiurn.substring(0, 2),
      ThirdLevelCode: ptiurn.substring(2, 4),
      BottomLevelCode: "00",
      OrganisationUnitCode: `${ptiurn.substring(0, 4)}00`
    }
  }
}
