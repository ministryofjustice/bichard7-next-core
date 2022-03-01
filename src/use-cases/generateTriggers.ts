import triggers from "src/triggers"
import type { Trigger } from "src/types/Trigger"
import type { TriggerGenerator } from "src/types/TriggerGenerator"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"

export default (courtResult: AnnotatedHearingOutcome, recordable: boolean): Trigger[] =>
  Object.values(triggers).reduce((acc: Trigger[], trigger: TriggerGenerator) => {
    return acc.concat(trigger(courtResult, recordable))
  }, [])
