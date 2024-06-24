import TriggerCode from "bichard7-next-data-latest//dist/types/TriggerCode"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import Phase from "../../types/Phase"
import * as triggers from "../triggers"
import deduplicateTriggers from "../triggers/deduplicateTriggers"
import filterExcludedTriggers from "../triggers/filterExcludedTriggers"
import type { Trigger } from "../types/Trigger"
import type { TriggerGenerator, TriggerGeneratorOptions } from "../types/TriggerGenerator"

const independentTriggerFn = (aho: AnnotatedHearingOutcome, options?: TriggerGeneratorOptions) =>
  Object.entries(triggers)
    .filter(([triggerCode]) => triggerCode != TriggerCode.TRPR0015 && triggerCode != TriggerCode.TRPR0027)
    .reduce((acc: Trigger[], [_, trigger]) => {
      return acc.concat(trigger(aho, options))
    }, [])

const generateSetOfTriggers = (
  generator: TriggerGenerator,
  aho: AnnotatedHearingOutcome,
  phase = Phase.HEARING_OUTCOME,
  existingTriggers: Trigger[] = []
): Trigger[] => {
  const generatedTriggers = generator(aho, { triggers: existingTriggers, phase })
  const filteredTriggers = filterExcludedTriggers(aho, generatedTriggers)

  // Generate TRPR0027 which depends on whether triggers have been excluded or not
  const triggersExcluded = generatedTriggers.length !== filteredTriggers.length
  const trigger27 = triggers.TRPR0027(aho, { triggersExcluded })

  const allTriggers = filteredTriggers.concat(trigger27)
  const finalTriggers = filterExcludedTriggers(aho, allTriggers)
  return existingTriggers.concat(finalTriggers)
}

export default (annotatedHearingOutcome: AnnotatedHearingOutcome, phase = Phase.HEARING_OUTCOME): Trigger[] => {
  // Run triggers which don't depend on any other triggers
  const independentTriggers = generateSetOfTriggers(independentTriggerFn, annotatedHearingOutcome, phase)

  // Generate TRPR0015 which depends on whether other triggers have been generated
  const finalTriggers = generateSetOfTriggers(triggers.TRPR0015, annotatedHearingOutcome, phase, independentTriggers)
  return deduplicateTriggers(finalTriggers)
}
