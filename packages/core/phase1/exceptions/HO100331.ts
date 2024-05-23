import { ExceptionCode } from "../../types/ExceptionCode"
import errorPaths from "../lib/errorPaths"
import type { ExceptionGenerator } from "../types/ExceptionGenerator"

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
