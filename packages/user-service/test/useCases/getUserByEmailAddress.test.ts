import type Database from "types/Database"
import { isError } from "types/Result"
import getUserByEmailAddress from "useCases/getUserByEmailAddress"

const database = <Database>(<unknown>{ oneOrNone: () => {} })

it("should return error when database returns error", async () => {
  const expectedError = new Error("Error message")

  jest.spyOn(database, "oneOrNone").mockResolvedValue(expectedError)

  const result = await getUserByEmailAddress(database, "DummyEmailAddress")

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe(expectedError.message)
})
