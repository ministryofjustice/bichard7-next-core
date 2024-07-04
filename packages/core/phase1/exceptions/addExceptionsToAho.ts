import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import { ExceptionCode } from "../../types/ExceptionCode"
import isPncException from "../lib/isPncException"
import type Exception from "../types/Exception"
import type { ExceptionPath } from "../types/Exception"

// prettier-ignore
const pncUpdateErrorCodes = [
  ExceptionCode.HO200100, ExceptionCode.HO200101, ExceptionCode.HO200103, ExceptionCode.HO200104,
  ExceptionCode.HO200106, ExceptionCode.HO200107, ExceptionCode.HO200108, ExceptionCode.HO200109,
  ExceptionCode.HO200110, ExceptionCode.HO200111, ExceptionCode.HO200112, ExceptionCode.HO200113,
  ExceptionCode.HO200114, ExceptionCode.HO200115, ExceptionCode.HO200116, ExceptionCode.HO200117,
  ExceptionCode.HO200118, ExceptionCode.HO200119, ExceptionCode.HO200120, ExceptionCode.HO200121,
  ExceptionCode.HO200122, ExceptionCode.HO100201, ExceptionCode.HO200123, ExceptionCode.HO200124,
  ExceptionCode.HO200201, ExceptionCode.HO200202, ExceptionCode.HO200203, ExceptionCode.HO200205,
  ExceptionCode.HO200210, ExceptionCode.HO200211, ExceptionCode.HO200212
]

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

const addExceptionsToAho = (aho: AnnotatedHearingOutcome, code: ExceptionCode, path: (string | number)[]) => {
  if (!aho.Exceptions) {
    aho.Exceptions = []
  }

  if (hasExceptionWithPath(path, aho.Exceptions) && !isPncException(code)) {
    removeExceptionWithPath(path, aho.Exceptions)
  }

  aho.Exceptions.push({ code, path })
  if (pncUpdateErrorCodes.includes(code)) {
    aho.HasError = true
  }
}

export default addExceptionsToAho
