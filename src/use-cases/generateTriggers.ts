import { TriggerCode } from "src/types/TriggerCode"
import triggers from "../triggers"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type { Trigger } from "../types/Trigger"

export default (courtResult: AnnotatedHearingOutcome, recordable: boolean): Trigger[] => {
  /* 
    Run independant triggers first
    Run trigger 15(?), pass it the independent triggers that have already been generated (and AHO probs)
    Filter the triggers by force, check that each one is allowed by force
    Run trigger 27, pass it all the generated triggers and the ignored triggers (and the AHO) - Out of area trigger

    Independant triggers -> GetAllTriggers
    Yeet Dependent triggers, replace with two well-commented specific calls

    TriggerGenerator interface -> Just a function
  */

  // Run triggers which don't depend on any other triggers
  const independentTriggers = Object.entries(triggers)
    .filter(([triggerCode]) => triggerCode != TriggerCode.TRPR0015 && triggerCode != TriggerCode.TRPR0027)
    .reduce((acc: Trigger[], [_, trigger]) => {
      return acc.concat(trigger.generate(courtResult, recordable))
    }, [])

  const trigger15 = triggers.TRPR0015.generate(courtResult, recordable, independentTriggers)
  const allTriggers = independentTriggers.concat(trigger15)
  return allTriggers
}
