import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import isPncLockError from "./isPncLockError"

describe("isPncLockError", () => {
  it.each([
    { exception: ExceptionCode.HO100404, message: "-PNCAM", expected: true },
    { exception: ExceptionCode.HO100404, message: "pncam", expected: true },
    { exception: ExceptionCode.HO100404, message: "PNCAM", expected: false },
    { exception: ExceptionCode.HO100404, message: "PNCAM-", expected: false },
    { exception: ExceptionCode.HO100401, message: "PNCAM", expected: false }
  ])(
    "should return $expected when exception is $exception and message is $message",
    ({ exception, message, expected }) => {
      const result = isPncLockError({ code: exception, message, path: [] })

      expect(result).toBe(expected)
    }
  )
})
