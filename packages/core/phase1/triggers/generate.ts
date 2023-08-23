import type { AnnotatedHearingOutcome } from "types/AnnotatedHearingOutcome"
import { TriggerCode } from "types/TriggerCode"
import triggers from "phase1/triggers"
import type { Trigger } from "phase1/types/Trigger"
import type { TriggerGenerator } from "phase1/types/TriggerGenerator"
import deduplicateTriggers from "phase1/triggers/deduplicateTriggers"
import filterExcludedTriggers from "phase1/triggers/filterExcludedTriggers"

const independentTriggerFn = (aho: AnnotatedHearingOutcome) =>
  Object.entries(triggers)
    .filter(([triggerCode]) => triggerCode != TriggerCode.TRPR0015 && triggerCode != TriggerCode.TRPR0027)
    .reduce((acc: Trigger[], [_, trigger]) => {
      return acc.concat(trigger(aho))
    }, [])

const generateSetOfTriggers = (
  generator: TriggerGenerator,
  aho: AnnotatedHearingOutcome,
  existingTriggers: Trigger[] = []
): Trigger[] => {
  const generatedTriggers = generator(aho, { triggers: existingTriggers })
  const filteredTriggers = filterExcludedTriggers(aho, generatedTriggers)

  // Generate TRPR0027 which depends on whether triggers have been excluded or not
  const triggersExcluded = generatedTriggers.length !== filteredTriggers.length
  const trigger27 = triggers.TRPR0027(aho, { triggersExcluded })

  const allTriggers = filteredTriggers.concat(trigger27)
  const finalTriggers = filterExcludedTriggers(aho, allTriggers)
  return existingTriggers.concat(finalTriggers)
}

export default (annotatedHearingOutcome: AnnotatedHearingOutcome): Trigger[] => {
  // Run triggers which don't depend on any other triggers
  const independentTriggers = generateSetOfTriggers(independentTriggerFn, annotatedHearingOutcome)

  // Generate TRPR0015 which depends on whether other triggers have been generated
  const finalTriggers = generateSetOfTriggers(triggers.TRPR0015, annotatedHearingOutcome, independentTriggers)
  return deduplicateTriggers(finalTriggers)
}
