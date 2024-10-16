import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import type { Exception } from "types/exceptions"
import hasOffenceMatchingExceptions from "./hasOffenceMatchingExceptions"

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
