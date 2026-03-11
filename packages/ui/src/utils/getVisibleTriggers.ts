import type { DisplayFullUser } from "../types/display/Users"
import allExcludedTriggers from "./triggerGroups/allExcludedTriggers"
import type { TriggerDefinition } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"

export default function getVisibleTriggers(
  user: DisplayFullUser,
  triggerDefinitions: TriggerDefinition[],
  forceExcludedTriggers: Record<string, string[]>
): string[] {
  const excludedTriggers = allExcludedTriggers(user, forceExcludedTriggers)
  return triggerDefinitions.map((td) => td.code).filter((code) => !excludedTriggers.includes(code))
}
