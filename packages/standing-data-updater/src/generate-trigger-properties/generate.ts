import fs from "node:fs"
import type { TriggerCode } from "@moj-bichard7/standing-data/types/types"
import { excludedTriggerConfig } from "@moj-bichard7/standing-data"

const generateForceConfig = (force: string, triggers: TriggerCode[]): string => {
  const includeRule: string[] = [`trigger.rule.${force}=include`]
  return includeRule.concat(triggers.map((trigger) => `trigger.rule.${force}.${trigger}=exclude`)).join("\n")
}

const forces: string[] = Object.keys(excludedTriggerConfig).sort()

fs.writeFileSync(
  "./output-data/data/triggers.properties",
  forces.map((force) => generateForceConfig(force, excludedTriggerConfig[force])).join("\n\n")
)
