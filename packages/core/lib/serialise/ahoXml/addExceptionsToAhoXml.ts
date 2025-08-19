import type {
  AhoXml,
  Br7TextString,
  Br7TypeTextString,
  GenericAhoXml,
  GenericAhoXmlValue
} from "@moj-bichard7/common/types/AhoXml"
import type Exception from "@moj-bichard7/common/types/Exception"

import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "@moj-bichard7/common/aho/exceptions/errorPaths"

import Phase from "../../../types/Phase"
import isPncException from "../../exceptions/isPncException"
import addAhoErrors from "./addAhoErrors"

const isBr7TextString = (element: GenericAhoXmlValue): boolean => typeof element === "object"

const findNamespacedKey = (element: GenericAhoXmlValue, key: number | string): Error | GenericAhoXmlValue => {
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

const reorderAttributesToPutErrorFirst = (element: Partial<Br7TypeTextString>): void => {
  if ("@_Type" in element) {
    const type = element["@_Type"]
    delete element["@_Type"]
    element["@_Type"] = type
  }
}

const addException = (aho: AhoXml, exception: Exception): Error | void => {
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
  exceptions.some((e) => !isPncException(e.code) && e.path.join("/") === errorPaths.case.asn.join("/"))

const isPncAsnException = (exception: Exception): boolean =>
  isPncException(exception.code) && exception.path.join("/") === errorPaths.case.asn.join("/")

// TODO: This reverse function is only needed because the order of the PNC exceptions affects which exception gets put on to the ASN
// It is only there to make sure the comparisons pass. Once we have gone live it can be removed since we don't really mind which exception is used
const sortAsnExceptions = (exceptions: Exception[]): Exception[] => {
  const pncAsnExceptions = exceptions.filter(isPncAsnException)
  const otherExceptions = exceptions.filter((exception) => !isPncAsnException(exception))
  return [...otherExceptions, ...pncAsnExceptions.reverse()]
}

// TODO: Refactor to remove duplication from this function and below
const addExceptionsToPncUpdateDatasetXml = (
  aho: AhoXml,
  exceptions: Exception[] | undefined,
  addFalseHasErrorAttributes = true
): Error | void => {
  if (!exceptions) {
    return
  }

  const sortedExceptions = sortAsnExceptions(exceptions)

  for (const e of sortedExceptions) {
    if (
      !isPncAsnException(e) ||
      (isPncAsnException(e) &&
        !hasNonPncAsnExceptions(sortedExceptions) &&
        e.code !== ExceptionCode.HO100315 &&
        e.code !== ExceptionCode.HO100403)
    ) {
      addException(aho, e)
    }
  }

  addAhoErrors(aho, sortedExceptions, addFalseHasErrorAttributes, Phase.PNC_UPDATE)
}

const addExceptionsToAhoXml = (aho: AhoXml, exceptions: Exception[] | undefined): Error | void => {
  if (!exceptions) {
    return
  }

  for (const e of exceptions) {
    if (
      !isPncAsnException(e) ||
      (isPncAsnException(e) && !hasNonPncAsnExceptions(exceptions) && e.code !== ExceptionCode.HO100315)
    ) {
      addException(aho, e)
    }
  }

  addAhoErrors(aho, exceptions)
}

export { addExceptionsToAhoXml, addExceptionsToPncUpdateDatasetXml }
