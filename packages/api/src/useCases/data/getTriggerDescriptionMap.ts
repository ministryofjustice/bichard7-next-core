import triggerDefinitions from "@moj-bichard7-developers/bichard7-next-data/dist/data/trigger-definitions.json"

const triggerMap = new Map<string, string>()

Object.values(triggerDefinitions).forEach((def) => {
  triggerMap.set(def.code, def.shortDescription ?? def.description ?? "Description unavailable")
})

export default triggerMap
