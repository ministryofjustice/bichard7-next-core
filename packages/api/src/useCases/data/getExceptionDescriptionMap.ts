import exceptionDefinitions from "./exceptionDefinitions.json"

const exceptionMap = new Map<string, string>()

Object.values(exceptionDefinitions).forEach((def) => {
  exceptionMap.set(def.code, def.description ?? "Description unavailable")
})

export default exceptionMap
