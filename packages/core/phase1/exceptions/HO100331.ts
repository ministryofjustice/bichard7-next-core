import { ExceptionCode } from "types/ExceptionCode"
import errorPaths from "phase1/lib/errorPaths"
import type { ExceptionGenerator } from "phase1/types/ExceptionGenerator"

const HO100331: ExceptionGenerator = (hearingOutcome) => {
  const offenceCount = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.length

  if (offenceCount > 100) {
    return [
      {
        code: ExceptionCode.HO100331,
        path: errorPaths.case.magistratesCourtReference
      }
    ]
  }
  return []
}

export default HO100331
