import GroupedTriggerCodes from "@moj-bichard7-developers/bichard7-next-data/dist/types/GroupedTriggerCodes"
import type { TriggerCodeGroups } from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import type TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

const allGroupedTriggers = (key: string): TriggerCode[] => GroupedTriggerCodes[key as keyof typeof TriggerCodeGroups]

export default allGroupedTriggers
