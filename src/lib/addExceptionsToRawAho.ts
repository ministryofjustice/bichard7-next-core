import type Exception from "src/types/Exception"
import type { Br7TextString, GenericRawAho, GenericRawAhoValue, RawAho } from "src/types/RawAho"

const isBr7TextString = (element: GenericRawAhoValue): boolean => typeof element === "object"

const findNamespacedKey = (element: GenericRawAhoValue, key: string | number): GenericRawAhoValue | Error => {
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

const findElement = (element: GenericRawAhoValue, path: (number | string)[]): Br7TextString | Error => {
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

const addExceptionsToRawAho = (aho: RawAho, exceptions: Exception[] | undefined): void | Error => {
  if (!exceptions) {
    return
  }
  for (const e of exceptions) {
    const element = findElement(aho as unknown as GenericRawAho, e.path)

    if (element instanceof Error) {
      return element
    }
    if (isBr7TextString(element)) {
      element["@_Error"] = e.code
    }
  }
}

export default addExceptionsToRawAho
