import type Exception from "../types/Exception"
import { ExceptionCode } from "../types/ExceptionCode"
import deduplicateExceptions from "./deduplicateExceptions"

describe("deduplicateExceptions", () => {
  it("should remove duplicates", () => {
    const exceptions: Exception[] = [
      { code: ExceptionCode.HO100100, path: ["path", "one"] },
      { code: ExceptionCode.HO100101, path: ["path", "two"] },
      { code: ExceptionCode.HO100101, path: ["path", "two"] }
    ]
    const result = deduplicateExceptions(exceptions)
    expect(result).toStrictEqual([
      { code: ExceptionCode.HO100100, path: ["path", "one"] },
      { code: ExceptionCode.HO100101, path: ["path", "two"] }
    ])
  })
  it("should not remove non-duplicates", () => {
    const exceptions: Exception[] = [
      { code: ExceptionCode.HO100100, path: ["path", "one"] },
      { code: ExceptionCode.HO100101, path: ["path", "two"] },
      { code: ExceptionCode.HO100101, path: ["path", "three"] }
    ]
    const result = deduplicateExceptions(exceptions)
    expect(result).toStrictEqual([
      { code: ExceptionCode.HO100100, path: ["path", "one"] },
      { code: ExceptionCode.HO100101, path: ["path", "two"] },
      { code: ExceptionCode.HO100101, path: ["path", "three"] }
    ])
  })

  it("should handle an empty list of exceptions", () => {
    const result = deduplicateExceptions([])
    expect(result).toStrictEqual([])
  })
})
