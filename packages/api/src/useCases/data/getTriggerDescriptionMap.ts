import { triggerDefinitions } from "@moj-bichard7/standing-data"

const triggerMap = new Map<string, string>()

Object.values(triggerDefinitions).forEach((def) => {
  triggerMap.set(def.code, def.shortDescription ?? def.description ?? "Description unavailable")
})

export default triggerMap
