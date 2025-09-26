import Database from "types/Database"
import { isError } from "types/Result"
import getUserByUsername from "useCases/getUserByUsername"

const database = <Database>(<unknown>{ oneOrNone: () => {} })

it("should return error when database returns error", async () => {
  const expectedError = new Error("Error message")

  jest.spyOn(database, "oneOrNone").mockImplementation(() => {
    throw expectedError
  })

  const result = await getUserByUsername(database, "DummyUsername")

  expect(isError(result)).toBe(true)
  expect((result as Error).message).toBe("Error message")

  const actualError = <Error>result
  expect(actualError.message).toBe(expectedError.message)
})
