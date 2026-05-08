import exceptionDefinitions from "@moj-bichard7-developers/bichard7-next-data/dist/data/exception-definitions.json"

const exceptionMap = new Map<string, string>()

Object.values(exceptionDefinitions).forEach((def) => {
  exceptionMap.set(def.code, def.shortDescription ?? def.description ?? "Unknown Exception")
})

export default exceptionMap
