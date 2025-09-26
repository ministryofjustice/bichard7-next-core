import Database from "types/Database"
import { isError } from "types/Result"
import getUserSpecificGroups from "useCases/getUserSpecificGroups"

const database = <Database>(<unknown>{ any: () => {} })

it("should return error when database returns error", async () => {
  const expectedError = new Error("Dummy error message")
  jest.spyOn(database, "any").mockRejectedValue(expectedError)

  const result = await getUserSpecificGroups(database, "dummyUsername")

  expect(isError(result)).toBe(true)

  const actualError = result as Error
  expect(actualError.message).toBe(expectedError.message)
})
