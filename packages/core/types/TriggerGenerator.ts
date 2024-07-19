import type { AnnotatedHearingOutcome } from "./AnnotatedHearingOutcome"
import type Phase from "./Phase"
import type { Trigger } from "./Trigger"

export type TriggerGeneratorOptions = {
  triggers?: Trigger[]
  triggersExcluded?: boolean
  phase?: Phase
}

export type TriggerGenerator = (hearingOutcome: AnnotatedHearingOutcome, options?: TriggerGeneratorOptions) => Trigger[]
