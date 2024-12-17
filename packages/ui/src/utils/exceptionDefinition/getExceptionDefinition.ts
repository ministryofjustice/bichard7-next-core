import type { ExceptionDefinition } from "types/ExceptionDefinition"
import exceptionDefinitions from "./exception-definitions.json"

const getExceptionDefinition = (exceptionCode: string): ExceptionDefinition | undefined =>
  exceptionDefinitions.find(({ code }) => code === exceptionCode)

export default getExceptionDefinition
