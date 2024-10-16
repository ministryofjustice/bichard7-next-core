import { exceptionDefinitions } from "@moj-bichard7-developers/bichard7-next-data/dist"
import type { ExceptionDefinition } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"

const getExceptionDefinition = (exceptionCode: string): ExceptionDefinition | undefined =>
  exceptionDefinitions.find(({ code }) => code === exceptionCode)

export default getExceptionDefinition
