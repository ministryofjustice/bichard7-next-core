import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import hasOffenceMatchingExceptions, { filterOffenceMatchingException } from "./hasOffenceMatchingExceptions"
import { Exception } from "types/exceptions"

describe("hasOffenceMatchingExceptions", () => {
  it("returns false when given empty array", () => {
    const result = hasOffenceMatchingExceptions([])
    expect(result).toBe(false)
  })

  it("returns false when given exception that is not in array of valid values", () => {
    const exception: Exception = { code: ExceptionCode.HO100312, path: ["test"] }
    const result = hasOffenceMatchingExceptions([exception])
    expect(result).toBe(false)
  })

  it("returns true when given exception that is in array of valid values", () => {
    const exception: Exception = { code: ExceptionCode.HO100310, path: ["test"] }
    const result = hasOffenceMatchingExceptions([exception])
    expect(result).toBe(true)
  })

  it("returns true if given multiple exceptions and one is in array of valid values", () => {
    const exceptions: Exception[] = [
      { code: ExceptionCode.HO100310, path: ["test"] },
      { code: ExceptionCode.HO100312, path: ["test"] }
    ]
    const result = hasOffenceMatchingExceptions(exceptions)
    expect(result).toBe(true)
  })
})

describe("filterOffenceMatchingException", () => {
  it("returns an empty array when given no exceptions", () => {
    const result = filterOffenceMatchingException([])
    expect(result).toEqual([])
  })

  it("returns an empty array when given exception that is not in array of valid values", () => {
    const exception: Exception = { code: ExceptionCode.HO100312, path: ["test"] }
    const result = filterOffenceMatchingException([exception])
    expect(result).toEqual([])
  })

  it("returns exception when given exception that is in array of valid values", () => {
    const exception: Exception = { code: ExceptionCode.HO100310, path: ["test"] }
    const result = filterOffenceMatchingException([exception])
    expect(result).toEqual([exception])
  })

  it("returns exception when given multiple exceptions and exception is in array of valid values", () => {
    const exceptions: Exception[] = [
      { code: ExceptionCode.HO100310, path: ["test"] },
      { code: ExceptionCode.HO100312, path: ["test"] }
    ]
    const result = filterOffenceMatchingException(exceptions)
    expect(result).toEqual([exceptions[0]])
  })
})
