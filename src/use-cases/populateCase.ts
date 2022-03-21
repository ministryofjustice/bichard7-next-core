import type { Case } from "../types/AnnotatedHearingOutcome"
import type { ResultedCaseMessageParsedXml } from "../types/IncomingMessage"
import populateDefendant from "./populateDefendant"

export default (courtResult: ResultedCaseMessageParsedXml): Case => {
  const {
    Session: {
      Case: { PTIURN }
    }
  } = courtResult

  return {
    PTIURN: PTIURN?.toUpperCase(),
    PreChargeDecisionIndicator: "N",
    CourtReference: {
      MagistratesCourtReference: PTIURN
    },
    HearingDefendant: populateDefendant(courtResult),
    ForceOwner: {
      SecondLevelCode: PTIURN.substring(0, 2),
      ThirdLevelCode: "",
      BottomLevelCode: "",
      OrganisationUnitCode: "0000000"
    }
  }
}
