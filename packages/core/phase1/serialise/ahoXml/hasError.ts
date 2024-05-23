import type Exception from "../../types/Exception"
import { ExceptionCode } from "../../../types/ExceptionCode"

const errorElementHierarchy = ["Hearing", "Case", "HearingDefendant", "Offence", "Result"]

const mostSpecificErrorElement = (path: (string | number)[]) => {
  const matchingElements = errorElementHierarchy.filter((value) => path.includes(value))
  return matchingElements.pop()
}

const shouldIgnoreHasError = (exception: Exception, elementPath: (string | number)[]): boolean => {
  return (
    [ExceptionCode.HO200104, ExceptionCode.HO200101, ExceptionCode.HO200108].includes(exception.code) &&
    elementPath[elementPath.length - 2] === "Result"
  )
}

const exceptionMatchesElement = (exception: Exception, elementPath: (string | number)[]) => {
  const exceptionElement = mostSpecificErrorElement(exception.path)
  const pathElement = mostSpecificErrorElement(elementPath)
  const exceptionPath = exception.path.join("/") + "/"
  const joinedElementPath = elementPath.join("/") + "/"

  if (shouldIgnoreHasError(exception, elementPath)) {
    return false
  }

  return (
    (exceptionElement === pathElement || (exceptionElement === "Result" && pathElement === "Offence")) &&
    exceptionPath.startsWith(joinedElementPath)
  )
}

const hasError = (exceptions: Exception[] | undefined, path: (string | number)[] = []): boolean => {
  if (!exceptions || exceptions.length === 0) {
    return false
  }

  if (path.length > 0) {
    return exceptions.some((e) => exceptionMatchesElement(e, path))
  }

  return exceptions.length > 0
}

export default hasError
