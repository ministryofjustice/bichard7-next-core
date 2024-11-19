import type { TriggerCodeGroups } from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import type TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import GroupedTriggerCodes from "@moj-bichard7-developers/bichard7-next-data/dist/types/GroupedTriggerCodes"

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
