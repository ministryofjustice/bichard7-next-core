import type { AhoXml, Br7TextString, GenericAhoXml, GenericAhoXmlValue } from "src/types/AhoXml"
import type Exception from "src/types/Exception"
import { ExceptionCode } from "src/types/ExceptionCode"

const isBr7TextString = (element: GenericAhoXmlValue): boolean => typeof element === "object"

const findNamespacedKey = (element: GenericAhoXmlValue, key: string | number): GenericAhoXmlValue | Error => {
  if (Array.isArray(element) && typeof key === "number") {
    return element[key]
  }
  if (element === undefined || typeof element === "string" || Array.isArray(element) || "#text" in element) {
    return new Error("Could not find key")
  }
  const keys = Object.keys(element)
  const foundKey = keys.find((k) => k.endsWith(`:${key}`))
  if (foundKey && foundKey in element) {
    return element[foundKey]
  }
  return new Error("Could not find key")
}

const findElement = (element: GenericAhoXmlValue, path: (number | string)[]): Br7TextString | Error => {
  const nextElementIndex = path[0]
  const nextElement = findNamespacedKey(element, nextElementIndex)
  if (nextElement instanceof Error || typeof nextElement === "string") {
    return new Error("Could not find element")
  }

  if (path.length > 1) {
    return findElement(nextElement, path.slice(1))
  }
  if (path.length === 1) {
    if (!isBr7TextString(nextElement)) {
      return Error("Could not find element")
    }
    return nextElement as Br7TextString
  }
  return Error("Could not find element")
}

const pncErrors = [
  ExceptionCode.HO100301,
  ExceptionCode.HO100302,
  ExceptionCode.HO100313,
  ExceptionCode.HO100314,
  ExceptionCode.HO100315
]

const addExceptionsToAhoXml = (aho: AhoXml, exceptions: Exception[] | undefined): void | Error => {
  if (!exceptions) {
    return
  }
  for (const e of exceptions) {
    const element = findElement(aho as unknown as GenericAhoXml, e.path)

    if (element instanceof Error) {
      return element
    }
    if (isBr7TextString(element)) {
      element["@_Error"] = e.code
    }
  }

  // Add PNC errors to the PNC error message if it is set
  if (aho["br7:AnnotatedHearingOutcome"]?.["br7:PNCErrorMessage"]) {
    const pncError = exceptions.find((e) => pncErrors.includes(e.code))
    if (pncError) {
      aho["br7:AnnotatedHearingOutcome"]["br7:PNCErrorMessage"]["@_classification"] = pncError.code
    }
  }
}

export default addExceptionsToAhoXml
