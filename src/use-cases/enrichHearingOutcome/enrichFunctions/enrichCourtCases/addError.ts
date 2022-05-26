import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import type { ExceptionCode } from "src/types/ExceptionCode"

const addError = (aho: AnnotatedHearingOutcome, code: ExceptionCode, path: string[]) => {
  if (!aho.Exceptions) {
    aho.Exceptions = []
  }
  aho.Exceptions.push({ code, path })
}

export default addError
