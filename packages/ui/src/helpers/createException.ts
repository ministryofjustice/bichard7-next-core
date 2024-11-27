import type ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import type { Exception } from "types/exceptions"

const createException = (code: ExceptionCode, path?: string[]): Exception => ({
  code,
  path: path || ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "Offence", "Result"]
})

export default createException
