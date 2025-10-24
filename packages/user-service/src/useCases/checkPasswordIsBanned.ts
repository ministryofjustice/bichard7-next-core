import bannedPasswords from "lib/bannedPasswords"
import type { Result } from "types/Result"

const bannedPasswordsDictionary = Object.assign({}, ...bannedPasswords.split("\n").map((word) => ({ [word]: true })))

const checkPasswordIsBanned = (newPassword: string): Result<void> => {
  if (newPassword in bannedPasswordsDictionary) {
    return new Error("Password is too simple or easy to guess. Use a stronger password.")
  }

  return undefined
}

export default checkPasswordIsBanned
