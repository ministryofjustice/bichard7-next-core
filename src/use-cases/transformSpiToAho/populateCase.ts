import type { Case } from "src/types/AnnotatedHearingOutcome"
import type { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import populateDefendant from "./populateDefendant"

export default (courtResult: ResultedCaseMessageParsedXml): Case => {
  const {
    Session: {
      Case: { PTIURN }
    }
  } = courtResult

  return {
    PTIURN: PTIURN?.toUpperCase(),
    PreChargeDecisionIndicator: false,
    CourtReference: {
      MagistratesCourtReference: PTIURN
    },
    HearingDefendant: populateDefendant(courtResult),
    ForceOwner: {
      SecondLevelCode: PTIURN.substring(0, 2),
      ThirdLevelCode: PTIURN.substring(2, 4),
      BottomLevelCode: "00",
      OrganisationUnitCode: `${PTIURN.substring(0, 4)}00`
    }
  }
}
