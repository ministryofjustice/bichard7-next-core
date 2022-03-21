import type { OrganisationUnit } from "src/types/AnnotatedHearingOutcome"
import type { Trigger } from "src/types/Trigger"
import forceTriggerConfig from "../../data/force-trigger-config.json"

interface ForceTriggerConfig {
  [forceCode: string]: {
    excludedTriggers: string[]
  }
}

const filterTriggersByForce = (force: OrganisationUnit, triggers: Trigger[]): Trigger[] => {
  const forceConfig = (forceTriggerConfig as ForceTriggerConfig)[force.SecondLevelCode]
  const forceExcludedTriggers = forceConfig ? forceConfig.excludedTriggers : []
  return triggers.filter((trigger) => !forceExcludedTriggers.includes(trigger.code))
}

export default filterTriggersByForce
