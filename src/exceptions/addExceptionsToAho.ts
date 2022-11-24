import type { ExceptionPath } from "src/types/Exception"
import type Exception from "src/types/Exception"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type { ExceptionCode } from "../types/ExceptionCode"

const hasExceptionWithPath = (path: ExceptionPath, existingExceptions: Exception[]): boolean =>
  existingExceptions.some((e) => JSON.stringify(e.path) === JSON.stringify(path))

const addExceptionsToAho = (aho: AnnotatedHearingOutcome, code: ExceptionCode, path: (string | number)[]) => {
  if (!aho.Exceptions) {
    aho.Exceptions = []
  }
  if (!hasExceptionWithPath(path, aho.Exceptions)) {
    aho.Exceptions.push({ code, path })
  }
}

export default addExceptionsToAho
