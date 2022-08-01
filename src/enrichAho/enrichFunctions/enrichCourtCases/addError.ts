import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type { ExceptionCode } from "../../../types/ExceptionCode"

const addError = (aho: AnnotatedHearingOutcome, code: ExceptionCode, path: (string | number)[]) => {
  if (!aho.Exceptions) {
    aho.Exceptions = []
  }
  aho.Exceptions.push({ code, path })
}

export default addError
