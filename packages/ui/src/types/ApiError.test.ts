import { ApiError, isApiError } from "./ApiError"
import { isError } from "./Result"

describe("ApiError", () => {
  it("should return true if API error", () => {
    const error = new ApiError(404, "Not Found")
    expect(isApiError(error)).toBe(true)
  })

  it("should return false if for normal error", () => {
    const error = new Error("Normal error")
    expect(isApiError(error)).toBe(false)
  })

  it("should return false if not an error at all", () => {
    const error = "Error message"
    expect(isApiError(error)).toBe(false)
  })

  it("ApiError should still be identified as a normal error", () => {
    const error = new ApiError(404, "Not Found")
    expect(isError(error)).toBe(true)
  })
})
