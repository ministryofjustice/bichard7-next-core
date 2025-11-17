import type Database from "types/Database"
import { isError } from "types/Result"
import updateUserLastLogin from "useCases/updateUserLastLogin"

const database = <Database>(<unknown>{ result: () => {} })

it("should return error when database returns error", async () => {
  const expectedError = new Error("User not found.")

  jest.spyOn(database, "result").mockResolvedValue(expectedError)

  const result = await updateUserLastLogin(database, "DummyUserName")

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe(expectedError.message)
})
