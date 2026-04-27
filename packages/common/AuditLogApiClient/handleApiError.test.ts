import ApplicationError from "./ApplicationError"
import { handleApiError } from "./AuditLogApiClient" // You'd need to export it first

const timeoutErrorMessage = "with timeout message"
const applicationErrorMessage = "with application error message"

it("should return a timeout error when name is AbortError", () => {
  const abortError = new Error("Aborted")
  abortError.name = "AbortError"

  const result = handleApiError(abortError, timeoutErrorMessage, applicationErrorMessage)

  expect(result).toBeInstanceOf(Error)
  expect(result.message).toBe("Timed out with timeout message.")
})

it("should wrap a standard Error in an ApplicationError", () => {
  const standardError = new Error("API is down")

  const result = handleApiError(standardError, timeoutErrorMessage, applicationErrorMessage)

  expect(result).toBeInstanceOf(ApplicationError)
  expect(result.message).toContain("Error with application error message: API is down")
})

it("should handle non-Error objects gracefully", () => {
  const result = handleApiError("Something went wrong", timeoutErrorMessage, applicationErrorMessage)

  expect(result).toBeInstanceOf(ApplicationError)
  expect(result.message).toContain("Error with application error message: Something went wrong")
})
