import filterTriggersByForce from "src/triggers/filterTriggersByForce"
import { TriggerCode } from "src/types/TriggerCode"
import forceTriggerConfig from "../../data/force-trigger-config.json"
import triggers from "../triggers"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type { Trigger } from "../types/Trigger"

export default (annotatedHearingOutcome: AnnotatedHearingOutcome, recordable: boolean): Trigger[] => {
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
      return acc.concat(trigger.generate(annotatedHearingOutcome, recordable))
    }, [])

  const trigger15 = triggers.TRPR0015.generate(annotatedHearingOutcome, recordable, independentTriggers)
  const allTriggers = independentTriggers.concat(trigger15)

  const force = annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.SecondLevelCode
  if (!force) {
    throw Error("Force not found")
  }

  const forceFilteredTriggers = filterTriggersByForce(force, allTriggers, forceTriggerConfig)
  const triggersIgnored = forceFilteredTriggers.length !== allTriggers.length
  const trigger27 = triggers.TRPR0027.generate(annotatedHearingOutcome, triggersIgnored)

  return forceFilteredTriggers.concat(trigger27)
}
