import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import type Phase from "./Phase"
import type { Trigger } from "./Trigger"

export type TriggerGenerator = (hearingOutcome: AnnotatedHearingOutcome, options?: TriggerGeneratorOptions) => Trigger[]

export type TriggerGeneratorOptions = {
  phase?: Phase
  triggers?: Trigger[]
  triggersExcluded?: boolean
}
