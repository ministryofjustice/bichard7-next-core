import type { AnnotatedHearingOutcome } from "./AnnotatedHearingOutcome"
import type { Trigger } from "./Trigger"

export type TriggerGenerator = (
  hearingOutcome: AnnotatedHearingOutcome,
  options?: {
    triggers?: Trigger[]
    triggersExcluded?: boolean
  }
) => Trigger[]
