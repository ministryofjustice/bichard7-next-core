import type Database from "types/Database"
import { isError } from "types/Result"
import markUserAsDeleted from "useCases/markUserAsDeleted"

const database = <Database>(<unknown>{ none: () => {} })

it("should not return error when database successfully updates the user", async () => {
  jest.spyOn(database, "none").mockResolvedValue(null)

  const result = await markUserAsDeleted(database, "dummy_email_address@example.com", -1)

  expect(result).toBeNull()
})

it("should return error when database returns error", async () => {
  const expectedError = new Error("Error message")

  jest.spyOn(database, "none").mockResolvedValue(<never>expectedError)

  const result = await markUserAsDeleted(database, "dummy_email_address@example.com", -1)

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe(expectedError.message)
})
