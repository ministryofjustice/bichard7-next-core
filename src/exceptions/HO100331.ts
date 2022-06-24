import { ExceptionCode } from "src/types/ExceptionCode"
import type { ExceptionGenerator } from "src/types/ExceptionGenerator"

const HO100331: ExceptionGenerator = (hearingOutcome) => {
  const offenceCount = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.length

  if (offenceCount > 100) {
    return [
      {
        code: ExceptionCode.HO100331,
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "CourtReference", "MagistratesCourtReference"]
      }
    ]
  }
  return []
}

export default HO100331
