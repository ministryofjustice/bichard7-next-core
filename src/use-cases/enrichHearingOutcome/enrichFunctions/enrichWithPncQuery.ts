import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type PncGateway from "../../../types/PncGateway"

export default (annotatedHearingOutcome: AnnotatedHearingOutcome, pncGateway: PncGateway): AnnotatedHearingOutcome => {
  annotatedHearingOutcome.PncQuery = pncGateway.query(
    annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  )

  return annotatedHearingOutcome
}
