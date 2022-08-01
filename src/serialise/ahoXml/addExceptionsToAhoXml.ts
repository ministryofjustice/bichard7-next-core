import errorPaths from "../../lib/errorPaths"
import type { AhoXml, Br7TextString, Br7TypeTextString, GenericAhoXml, GenericAhoXmlValue } from "../../types/AhoXml"
import type Exception from "../../types/Exception"
import { ExceptionCode } from "../../types/ExceptionCode"

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

const reorderAttributesToPutErrorFirst = (element: Partial<Br7TypeTextString>): void => {
  if ("@_Type" in element) {
    const type = element["@_Type"]
    delete element["@_Type"]
    element["@_Type"] = type
  }
}

const addException = (aho: AhoXml, exception: Exception): void | Error => {
  const element = findElement(aho as unknown as GenericAhoXml, exception.path)
  if (element instanceof Error) {
    return element
  }
  if (isBr7TextString(element)) {
    element["@_Error"] = exception.code
    reorderAttributesToPutErrorFirst(element)
  }
}

const hasNonPncAsnExceptions = (exceptions: Exception[]): boolean =>
  exceptions.some((e) => !pncErrors.includes(e.code) && e.path.join("/") === errorPaths.case.asn.join("/"))

const isPncAsnException = (exception: Exception): boolean =>
  pncErrors.includes(exception.code) && exception.path.join("/") === errorPaths.case.asn.join("/")

const addExceptionsToAhoXml = (aho: AhoXml, exceptions: Exception[] | undefined): void | Error => {
  if (!exceptions) {
    return
  }

  for (const e of exceptions) {
    if (
      !isPncAsnException(e) ||
      (isPncAsnException(e) && !hasNonPncAsnExceptions(exceptions) && e.code !== ExceptionCode.HO100315)
    ) {
      const result = addException(aho, e)
      if (result instanceof Error) {
        return result
      }
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
