import GroupedTriggerCodes from "@moj-bichard7/standing-data/types/GroupedTriggerCodes"
import type { TriggerCodeGroups } from "@moj-bichard7/standing-data/types/TriggerCode"
import type TriggerCode from "@moj-bichard7/standing-data/types/TriggerCode"

const allGroupedTriggers = (key: string, excludedTriggers: string[]): TriggerCode[] => {
  const refinedGroupedTriggers = Object.fromEntries(
    Object.entries(GroupedTriggerCodes).map(([groupKey, triggers]) => [
      groupKey,
      triggers.filter((trigger) => !excludedTriggers.includes(trigger))
    ])
  ) as Record<TriggerCodeGroups, TriggerCode[]>

  return refinedGroupedTriggers[key as keyof typeof TriggerCodeGroups]
}

export default allGroupedTriggers
