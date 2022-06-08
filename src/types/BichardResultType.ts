import type { AnnotatedHearingOutcome } from "./AnnotatedHearingOutcome"
import type { Trigger } from "./Trigger"

type BichardResultType = {
  triggers: Trigger[]
  hearingOutcome: AnnotatedHearingOutcome
}

export default BichardResultType
