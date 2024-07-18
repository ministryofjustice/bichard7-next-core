import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Phase from "../../types/Phase"
import type { Trigger } from "../../types/Trigger"

export type TriggerGeneratorOptions = {
  triggers?: Trigger[]
  triggersExcluded?: boolean
  phase?: Phase
}

export type TriggerGenerator = (hearingOutcome: AnnotatedHearingOutcome, options?: TriggerGeneratorOptions) => Trigger[]
