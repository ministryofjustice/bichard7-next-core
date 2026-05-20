import { remandRequestSchema } from "@moj-bichard7/core/schemas/leds/remandRequest"
import type { RemandRequest } from "@moj-bichard7/core/types/leds/RemandRequest"
import type { MockRemandRequest } from "../../../types/MockRemandRequest"

const convertRemandRequestMockJsonToLeds = (mockJson: MockRemandRequest): RemandRequest => {
  const allConditions = mockJson.bailConditions.map((condition) => condition.trim())
  const ledsConditions = []
  while (allConditions.length > 0) {
    const conditions = allConditions.splice(0, 4)
    ledsConditions.push(Array.from({ length: 4 }, (_, i) => conditions[i] ?? "").join("\n"))
  }

  mockJson.bailConditions = ledsConditions

  return remandRequestSchema.parse(mockJson)
}

export default convertRemandRequestMockJsonToLeds
