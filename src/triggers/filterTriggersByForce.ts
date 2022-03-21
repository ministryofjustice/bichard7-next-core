import type ForceTriggerConfig from "src/types/ForceTriggerConfig"
import type { Trigger } from "src/types/Trigger"

const filterTriggersByForce = (
  force: string,
  triggers: Trigger[],
  forceTriggerConfig: ForceTriggerConfig
): Trigger[] => {
  const forceConfig = (forceTriggerConfig as ForceTriggerConfig)[force]
  const forceExcludedTriggers = forceConfig ? forceConfig.excludedTriggers : []
  return triggers.filter((trigger) => !forceExcludedTriggers.includes(trigger.code)) //TODO: Pass in court code and implement
}

export default filterTriggersByForce
