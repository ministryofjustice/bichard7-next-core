import bannedPasswords from "lib/bannedPasswords"
import type { Result } from "types/Result"

const bannedPasswordsDictionary = Object.assign({}, ...bannedPasswords.split("\n").map((word) => ({ [word]: true })))

const checkPasswordIsBanned = (newPassword: string): Result<void> => {
  if (newPassword in bannedPasswordsDictionary) {
    return Error("Password is too easy to guess.")
  }

  return undefined
}

export default checkPasswordIsBanned
