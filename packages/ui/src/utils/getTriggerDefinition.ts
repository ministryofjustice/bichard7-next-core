import { triggerDefinitions } from "@moj-bichard7-developers/bichard7-next-data/dist"
import type { TriggerDefinition } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"

const getTriggerDefinition = (triggerCode: string): TriggerDefinition | undefined =>
  triggerDefinitions.find(({ code }) => code === triggerCode)

export default getTriggerDefinition
