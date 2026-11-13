import { triggerDefinitions } from "@moj-bichard7/standing-data"
import type { TriggerCode, TriggerDefinition } from "@moj-bichard7/standing-data/types/types"

const getTriggerDefinition = (triggerCode: string): TriggerDefinition | undefined =>
  triggerDefinitions.find(({ code }: { code: TriggerCode }) => code === triggerCode)

export default getTriggerDefinition
