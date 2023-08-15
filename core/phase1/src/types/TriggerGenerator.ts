import type { AnnotatedHearingOutcome } from "./AnnotatedHearingOutcome"
import type { Trigger } from "./Trigger"

export type TriggerGeneratorOptions = {
  triggers?: Trigger[]
  triggersExcluded?: boolean
}

export type TriggerGenerator = (hearingOutcome: AnnotatedHearingOutcome, options?: TriggerGeneratorOptions) => Trigger[]
