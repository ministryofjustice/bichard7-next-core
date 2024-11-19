import type { Result } from "../../../types/Result"
import "./index"

describe(".toNotBeError()", () => {
  test("passes when not given an error result", () => {
    const result: Result<string> = "not an error"

    expect(result).toNotBeError()
  })

  test("fails when given an error", () => {
    const result: Result<string> = new Error("this is an expected error")

    expect(() => {
      expect(result).toNotBeError()
    }).toThrowErrorMatchingSnapshot()
  })
})
