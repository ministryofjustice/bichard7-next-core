import type { AnnotatedHearingOutcome } from "types/AnnotatedHearingOutcome"
import type { Trigger } from "phase1/types/Trigger"

export type TriggerGeneratorOptions = {
  triggers?: Trigger[]
  triggersExcluded?: boolean
}

export type TriggerGenerator = (hearingOutcome: AnnotatedHearingOutcome, options?: TriggerGeneratorOptions) => Trigger[]
