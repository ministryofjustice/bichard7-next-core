import { remandRequestSchema } from "@moj-bichard7/core/schemas/leds/remandRequest"
import type { RemandRequest } from "@moj-bichard7/core/types/leds/RemandRequest"

const convertRemandRequestMockJsonToLeds = (mockJson: object): RemandRequest => {
  if ("bailConditions" in mockJson && Array.isArray(mockJson.bailConditions)) {
    mockJson.bailConditions = mockJson.bailConditions.filter((bailCondition) => bailCondition.trim().length > 0)
  }

  return remandRequestSchema.parse(mockJson)
}

export default convertRemandRequestMockJsonToLeds
