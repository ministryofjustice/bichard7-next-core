import type { AnnotatedHearingOutcome } from "./AnnotatedHearingOutcome"
import type { Trigger } from "./Trigger"

export type TriggerGenerator = {
  independent: boolean
  generate: (hearingOutcome: AnnotatedHearingOutcome, recordable: boolean, triggers?: Trigger[]) => Trigger[]
}
