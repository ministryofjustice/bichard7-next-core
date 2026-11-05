import fs from "fs"
import triggerConfig from "../../output-data/data/excluded-trigger-config.json"
import type { ExcludedTriggerConfig, TriggerCode } from "../../output-data/types/types"

const typedTriggerConfig = <ExcludedTriggerConfig>triggerConfig

const generateForceConfig = (force: string, triggers: TriggerCode[]): string => {
  const includeRule: string[] = [`trigger.rule.${force}=include`]
  return includeRule.concat(triggers.map((trigger) => `trigger.rule.${force}.${trigger}=exclude`)).join("\n")
}

const forces: string[] = Object.keys(typedTriggerConfig).sort()

fs.writeFileSync(
  "./output-data/data/triggers.properties",
  forces.map((force) => generateForceConfig(force, typedTriggerConfig[force])).join("\n\n")
)
