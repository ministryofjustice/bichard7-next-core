/**
 * @jest-environment node
 */

import type Database from "types/Database"
import { isError } from "types/Result"
import { changePassword } from "useCases"
import passwordSecurityCheck from "useCases/passwordSecurityCheck"
import fakeAuditLogger from "../fakeAuditLogger"

jest.mock("useCases/passwordSecurityCheck")

const connection = {} as Database

it("should return error when new password does not meet complexity requirements", async () => {
  const expectedError = new Error("Expected Error")
  const mockedPasswordSecurityCheck = passwordSecurityCheck as jest.MockedFunction<typeof passwordSecurityCheck>
  mockedPasswordSecurityCheck.mockReturnValue(expectedError)

  const result = await changePassword(connection, fakeAuditLogger, "DummyEmail", "DummyPassword", "DummyNewPassword")

  expect(isError(result)).toBe(true)

  const actualError = <Error>result
  expect(actualError.message).toBe(expectedError.message)
})
