import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionPath } from "../../types/Exception"

import isPncException from "./isPncException"

const hasExceptionWithPath = (path: ExceptionPath, existingExceptions: Exception[]): boolean =>
  existingExceptions.some((e) => JSON.stringify(e.path) === JSON.stringify(path))

const removeExceptionWithPath = (path: ExceptionPath, existingExceptions: Exception[]): void => {
  const element = existingExceptions.find((e) => JSON.stringify(e.path) === JSON.stringify(path))
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
