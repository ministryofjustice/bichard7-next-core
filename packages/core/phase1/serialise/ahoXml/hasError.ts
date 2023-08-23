import type Exception from "phase1/types/Exception"

const errorElementHierarchy = ["Hearing", "Case", "HearingDefendant", "Offence", "Result"]

const mostSpecificErrorElement = (path: (string | number)[]) => {
  const matchingElements = errorElementHierarchy.filter((value) => path.includes(value))
  return matchingElements.pop()
}

const exceptionMatchesElement = (exception: Exception, elementPath: (string | number)[]) => {
  const exceptionElement = mostSpecificErrorElement(exception.path)
  const pathElement = mostSpecificErrorElement(elementPath)
  const exceptionPath = exception.path.join("/") + "/"
  const joinedElementPath = elementPath.join("/") + "/"
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
