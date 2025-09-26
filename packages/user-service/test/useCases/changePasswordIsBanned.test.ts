import { isError } from "types/Result"
import checkPasswordIsBanned from "useCases/checkPasswordIsBanned"

it("should return error if password is banned", () => {
  let passwordResult = checkPasswordIsBanned("password")
  expect(isError(passwordResult)).toBe(true)

  passwordResult = checkPasswordIsBanned("qwerty")
  expect(isError(passwordResult)).toBe(true)

  passwordResult = checkPasswordIsBanned("12345678")
  expect(isError(passwordResult)).toBe(true)

  passwordResult = checkPasswordIsBanned("password123")
  expect(isError(passwordResult)).toBe(true)
})

it("should return undefined if password is not banned", () => {
  const passwordResult = checkPasswordIsBanned("Sup3r|S3cur3?P4ssW0rd!Th4t@Sh@uld£N3v3r$B3%H4ck3d")
  expect(passwordResult).toBe(undefined)
})
