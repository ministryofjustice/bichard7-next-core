import type { TriggerCode, TriggerDefinition } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"

import { triggerDefinitions } from "@moj-bichard7-developers/bichard7-next-data/dist"

const getTriggerDefinition = (triggerCode: string): TriggerDefinition | undefined =>
  triggerDefinitions.find(({ code }: { code: TriggerCode }) => code === triggerCode)

export default getTriggerDefinition
