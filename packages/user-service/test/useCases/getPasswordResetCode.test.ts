import Database from "types/Database"
import { isError } from "types/Result"
import getPasswordResetCode from "useCases/getPasswordResetCode"

const database = <Database>(<unknown>{ oneOrNone: () => {} })

it("should return error when database returns error", async () => {
  const expectedError = new Error("Error message")

  jest.spyOn(database, "oneOrNone").mockResolvedValue(expectedError)

  const result = await getPasswordResetCode(database, "DummyCode")

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe(expectedError.message)
})
