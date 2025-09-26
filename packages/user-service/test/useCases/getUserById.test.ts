import Database from "types/Database"
import { isError } from "types/Result"
import getUserById from "useCases/getUserById"

const database = <Database>(<unknown>{ one: () => {} })

it("should return error when database returns error", async () => {
  const expectedError = new Error("Error message")

  jest.spyOn(database, "one").mockImplementation(() => {
    throw expectedError
  })

  const result = await getUserById(database, 0)

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe(expectedError.message)
})
