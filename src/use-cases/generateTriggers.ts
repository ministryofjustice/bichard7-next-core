import triggers from "../triggers"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type { Trigger } from "../types/Trigger"
import type { TriggerGenerator } from "../types/TriggerGenerator"

//TODO: Replace with actual trigger.properties and
// const excludedTriggers = {
//   "01": ["TRPR0001", "TRPR0002"],
//   "02": ["TRPR0001", "TRPR0005"],
//   B01DU: ["TRPR0001", "TRPR0002"]
// }

const generateConfiguredTriggers = (courtResult: AnnotatedHearingOutcome, recordable: boolean): Trigger[] => {
  const t: Trigger[] = Object.values(triggers).reduce((acc: Trigger[], trigger: TriggerGenerator) => {
    console.log(`${courtResult}${trigger}`) //TODO: Replace with call to specific triggers
    return acc.concat(trigger.generate(courtResult, recordable))
  }, [])
  return t
}

export default (courtResult: AnnotatedHearingOutcome, recordable: boolean): Trigger[] => {
  const independentTriggers = Object.values(triggers)
    .filter((t) => t.independent)
    .reduce((acc: Trigger[], trigger: TriggerGenerator) => {
      return acc.concat(trigger.generate(courtResult, recordable))
    }, [])

  const trigger15 = triggers.TRPR0015.generate(courtResult, recordable)

  const configuredTriggers = generateConfiguredTriggers(courtResult, recordable)

  // const dependentTriggers = Object.values(triggers)
  //   .filter((t) => !t.independent)
  //   .reduce((acc: Trigger[], trigger: TriggerGenerator) => {
  //     return acc.concat(trigger.generate(courtResult, recordable, independentTriggers))
  //   }, [])

  return independentTriggers.concat(trigger15, configuredTriggers)
}
