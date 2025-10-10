import type Database from "types/Database"
import { isError } from "types/Result"
import updatePassword from "useCases/updatePassword"

const database = <Database>(<unknown>{ result: () => {} })

it("should return error when database returns error", async () => {
  const expectedError = new Error("Error message")

  jest.spyOn(database, "result").mockResolvedValue(expectedError)

  const result = await updatePassword(database, "DummyEmailAddress", "DummyPassword")

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe(expectedError.message)
})
