import isPncException from "src/lib/isPncException"
import type Exception from "src/types/Exception"
import type { ExceptionPath } from "src/types/Exception"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type { ExceptionCode } from "../types/ExceptionCode"

const hasExceptionWithPath = (path: ExceptionPath, existingExceptions: Exception[]): boolean =>
  existingExceptions.some((e) => JSON.stringify(e.path) === JSON.stringify(path))

const addExceptionsToAho = (aho: AnnotatedHearingOutcome, code: ExceptionCode, path: (string | number)[]) => {
  if (!aho.Exceptions) {
    aho.Exceptions = []
  }
  if (!hasExceptionWithPath(path, aho.Exceptions) || isPncException(code)) {
    aho.Exceptions.push({ code, path })
  }
}

export default addExceptionsToAho
