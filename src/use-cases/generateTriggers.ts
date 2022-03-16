import triggers from "../triggers"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type { Trigger } from "../types/Trigger"
import type { TriggerGenerator } from "../types/TriggerGenerator"

export default (courtResult: AnnotatedHearingOutcome, recordable: boolean): Trigger[] => {
  const independentTriggers = Object.values(triggers)
    .filter((t) => t.independent)
    .reduce((acc: Trigger[], trigger: TriggerGenerator) => {
      return acc.concat(trigger.generate(courtResult, recordable))
    }, [])

  const dependentTriggers = Object.values(triggers)
    .filter((t) => !t.independent)
    .reduce((acc: Trigger[], trigger: TriggerGenerator) => {
      return acc.concat(trigger.generate(courtResult, recordable, independentTriggers))
    }, [])

  return independentTriggers.concat(dependentTriggers)
}
