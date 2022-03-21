import filterExcludedTriggers from "src/triggers/filterExcludedTriggers"
import { TriggerCode } from "src/types/TriggerCode"
import triggers from "../triggers"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type { Trigger } from "../types/Trigger"

export default (annotatedHearingOutcome: AnnotatedHearingOutcome, recordable: boolean): Trigger[] => {
  // Run triggers which don't depend on any other triggers
  const independentTriggers = Object.entries(triggers)
    .filter(([triggerCode]) => triggerCode != TriggerCode.TRPR0015 && triggerCode != TriggerCode.TRPR0027)
    .reduce((acc: Trigger[], [_, trigger]) => {
      return acc.concat(trigger(annotatedHearingOutcome, recordable))
    }, [])

  // Generate TRPR0015 which depends on whether other triggers have been generated
  const trigger15 = triggers.TRPR0015(annotatedHearingOutcome, recordable, independentTriggers)
  const allTriggers = independentTriggers.concat(trigger15)

  // Filter triggers which are excluded by specific forces or courts
  const filteredTriggers = filterExcludedTriggers(annotatedHearingOutcome, allTriggers)

  // Generate TRPR0027 which depends on whether triggers have been excluded or not
  const triggersExcluded = filteredTriggers.length !== allTriggers.length
  const trigger27 = triggers.TRPR0027(annotatedHearingOutcome, triggersExcluded)

  return filteredTriggers.concat(trigger27)
}
