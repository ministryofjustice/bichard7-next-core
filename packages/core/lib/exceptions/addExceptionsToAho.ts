import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionPath } from "../../types/Exception"
import isPncException from "./isPncException"

const pathsMatch = (path1: ExceptionPath, path2: ExceptionPath): boolean =>
  JSON.stringify(path1) === JSON.stringify(path2)

const hasExceptionWithPath = (path: ExceptionPath, existingExceptions: Exception[]): boolean =>
  existingExceptions.some((existingException) => pathsMatch(existingException.path, path))

const removeExceptionWithPath = (path: ExceptionPath, existingExceptions: Exception[]): void => {
  const element = existingExceptions.find(
    (existingException) => pathsMatch(existingException.path, path) && !isPncException(existingException.code)
  )

  if (element) {
    const elementId = existingExceptions.indexOf(element)
    if (elementId >= 0) {
      existingExceptions.splice(elementId, 1)
    }
  }
}

const addExceptionsToAho = (aho: AnnotatedHearingOutcome, exceptions: Exception[]) => {
  if (!aho.Exceptions) {
    aho.Exceptions = []
  }

  exceptions.forEach((exception) => {
    if (hasExceptionWithPath(exception.path, aho.Exceptions) && !isPncException(exception.code)) {
      removeExceptionWithPath(exception.path, aho.Exceptions)
    }

    aho.Exceptions.push(exception)
  })
}

export default addExceptionsToAho
