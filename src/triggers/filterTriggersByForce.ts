import type { OrganisationUnit } from "src/types/AnnotatedHearingOutcome"
import type ForceTriggerConfig from "src/types/ForceTriggerConfig"
import type { Trigger } from "src/types/Trigger"

const filterTriggersByForce = (
  force: OrganisationUnit,
  triggers: Trigger[],
  forceTriggerConfig: ForceTriggerConfig
): Trigger[] => {
  const forceConfig = (forceTriggerConfig as ForceTriggerConfig)[force.SecondLevelCode]
  const forceExcludedTriggers = forceConfig ? forceConfig.excludedTriggers : []
  return triggers.filter((trigger) => !forceExcludedTriggers.includes(trigger.code))
}

export default filterTriggersByForce
