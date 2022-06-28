import errorPaths from "src/lib/errorPaths"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { ExceptionGenerator } from "src/types/ExceptionGenerator"

const HO100507: ExceptionGenerator = (hearingOutcome) => {
  const offences = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  const isPenaltyCase = !!hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.PenaltyNoticeCaseReferenceNumber

  const raiseException = offences.some((offence) => offence.AddedByTheCourt && isPenaltyCase)

  if (raiseException) {
    return [{ code: ExceptionCode.HO100507, path: errorPaths.case.asn }]
  }
  return []
}

export default HO100507
