import type { DisplayFullUser } from "../types/display/Users"
import { triggerDefinitions } from "@moj-bichard7-developers/bichard7-next-data/dist"
import allExcludedTriggers from "./triggerGroups/allExcludedTriggers"
import forceExcludedTriggers from "@moj-bichard7-developers/bichard7-next-data/dist/data/excluded-trigger-config.json"

export default function getVisibleTriggers(user: DisplayFullUser): string[] {
  const excludedTriggers = allExcludedTriggers(user, forceExcludedTriggers)
  return triggerDefinitions.map((td) => td.code).filter((code) => !excludedTriggers.includes(code))
}
