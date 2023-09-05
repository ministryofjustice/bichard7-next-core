import type { Result } from "../../../types/Result"
import "./index"

describe(".toBeError()", () => {
  test("passes when given an error result", () => {
    const result: Result<string> = new Error("this is an expected error")

    expect(result).toBeError("this is an expected error")
  })

  test("fails when not given an error", () => {
    const result: Result<string> = "not an error"

    expect(() => {
      expect(result).toBeError("not an error")
    }).toThrowErrorMatchingSnapshot()
  })
})
