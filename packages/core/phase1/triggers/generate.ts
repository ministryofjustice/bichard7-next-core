import identifyPostUpdateTriggers from "../../phase2/pncUpdateDataset/identifyPostUpdateTriggers"
import TriggerCode from "bichard7-next-data-latest//dist/types/TriggerCode"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import triggers from "../triggers"
import deduplicateTriggers from "../triggers/deduplicateTriggers"
import filterExcludedTriggers from "../triggers/filterExcludedTriggers"
import type { Trigger } from "../types/Trigger"
import type { TriggerGenerator } from "../types/TriggerGenerator"

const independentTriggerFn = (aho: AnnotatedHearingOutcome) =>
  Object.entries(triggers)
    .filter(([triggerCode]) => triggerCode != TriggerCode.TRPR0015 && triggerCode != TriggerCode.TRPR0027)
    .reduce((acc: Trigger[], [_, trigger]) => {
      return acc.concat(trigger(aho))
    }, [])

const generateSetOfTriggers = (
  generator: TriggerGenerator,
  aho: AnnotatedHearingOutcome | PncUpdateDataset,
  existingTriggers: Trigger[] = [],
  generatePostUpdateTriggers = false
): Trigger[] => {
  const generatedPreUpdateTriggers = generator(aho, { triggers: existingTriggers })
  const filteredPreUpdateTriggers = filterExcludedTriggers(aho, generatedPreUpdateTriggers)

  let generatedPostUpdateTriggers: Trigger[] = []
  let filteredPostUpdateTriggers: Trigger[] = []
  if (generatePostUpdateTriggers && "PncOperations" in aho) {
    generatedPostUpdateTriggers = identifyPostUpdateTriggers(aho)
    filteredPostUpdateTriggers = filterExcludedTriggers(aho, generatedPostUpdateTriggers)
  }

  const generatedTriggers = [...generatedPreUpdateTriggers, ...generatedPostUpdateTriggers]
  const filteredTriggers = [...filteredPreUpdateTriggers, ...filteredPostUpdateTriggers]

  // Generate TRPR0027 which depends on whether triggers have been excluded or not
  const triggersExcluded = generatedTriggers.length !== filteredTriggers.length
  const trigger27 = triggers.TRPR0027(aho, { triggersExcluded })

  const allTriggers = filteredTriggers.concat(trigger27)
  const finalTriggers = filterExcludedTriggers(aho, allTriggers)
  return existingTriggers.concat(finalTriggers)
}

export default (annotatedHearingOutcome: AnnotatedHearingOutcome, generatePostUpdateTriggers = false): Trigger[] => {
  // Run triggers which don't depend on any other triggers
  const independentTriggers = generateSetOfTriggers(independentTriggerFn, annotatedHearingOutcome)

  // Generate TRPR0015 which depends on whether other triggers have been generated
  const finalTriggers = generateSetOfTriggers(
    triggers.TRPR0015,
    annotatedHearingOutcome,
    independentTriggers,
    generatePostUpdateTriggers
  )
  return deduplicateTriggers(finalTriggers)
}
