import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type Exception from "../../../types/Exception"

const errorElementHierarchy = ["Hearing", "Case", "HearingDefendant", "Offence", "Result"]
const warningOnlyCodes = [ExceptionCode.HO200200]

const mostSpecificErrorElement = (path: (number | string)[]) => {
  const matchingElements = errorElementHierarchy.filter((value) => path.includes(value))
  return matchingElements.pop()
}

const shouldIgnoreHasError = (exception: Exception, elementPath: (number | string)[]): boolean => {
  const omitHasErrorFlagCodes = [ExceptionCode.HO200104, ExceptionCode.HO200101, ExceptionCode.HO200108]
  const element = elementPath[elementPath.length - 2]

  return (
    (element === "Result" && warningOnlyCodes.concat(omitHasErrorFlagCodes).includes(exception.code)) ||
    (element === "Offence" && warningOnlyCodes.includes(exception.code))
  )
}

const exceptionMatchesElement = (exception: Exception, elementPath: (number | string)[]) => {
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

const hasError = (exceptions: Exception[] | undefined, path: (number | string)[] = []): boolean => {
  if (!exceptions || exceptions.length === 0) {
    return false
  }

  if (path.length > 0) {
    return exceptions.some((e) => exceptionMatchesElement(e, path))
  }

  const filteredExceptions = exceptions.filter(({ code }) => !warningOnlyCodes.includes(code))

  return filteredExceptions.length > 0
}

export default hasError
