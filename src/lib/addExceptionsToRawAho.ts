import type Exception from "src/types/Exception"
import type { Br7TextString, GenericRawAho, GenericRawAhoValue, RawAho } from "src/types/RawAho"

const findNamespacedKey = (
  element: GenericRawAho | GenericRawAhoValue,
  key: string | number
): GenericRawAhoValue | Error => {
  if (typeof element === "string" || Array.isArray(element) || "#text" in element) {
    return new Error("Could not find key")
  }
  const keys = Object.keys(element)
  const foundKey = keys.find((k) => k.endsWith(`:${key}`))
  if (foundKey && foundKey in element) {
    return element[foundKey]
  }
  return new Error("Could not find key")
}

const findElement = (element: GenericRawAho | GenericRawAhoValue, path: (number | string)[]): Br7TextString | Error => {
  if (path.length > 1) {
    const nextElementIndex = path[0]
    if (Array.isArray(element) && typeof nextElementIndex === "number") {
      return findElement(element[nextElementIndex], path.slice(1))
    } else {
      const nextElement = findNamespacedKey(element, nextElementIndex)
      if (nextElement instanceof Error) {
        return nextElement
      }
      if (typeof nextElement === "string") {
        return new Error("Could not find element")
      }
      if (nextElement) {
        return findElement(nextElement, path.slice(1))
      }
    }
    return Error("Could not find element")
  }
  if (path.length === 1) {
    let targetElement: GenericRawAhoValue | Error
    if (Array.isArray(element) && typeof path[0] === "number") {
      const index = path[0]
      targetElement = element[index]
    } else {
      targetElement = findNamespacedKey(element, path[0])
    }
    if (targetElement instanceof Error) {
      return targetElement
    }
    if (typeof targetElement === "string" || Array.isArray(targetElement)) {
      return Error("Could not find element")
    }
    if (targetElement && "#text" in targetElement) {
      return targetElement as Br7TextString
    }
    return Error("Could not find element")
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
    if (typeof element === "object") {
      element["@_Error"] = e.code
    }
  }
}

export default addExceptionsToRawAho
