import type { Case } from "core/common/types/AnnotatedHearingOutcome"

const handle100Offences = (caseElem: Case): void => {
  if (caseElem.HearingDefendant.Offence.length > 100) {
    caseElem.CourtReference.MagistratesCourtReference = "100+ Offences"
  }
}

export default handle100Offences
