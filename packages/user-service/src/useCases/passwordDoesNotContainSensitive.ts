import type Database from "types/Database"
import type PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import getUserByEmailAddress from "./getUserByEmailAddress"

export default async (connection: Database, password: string, emailAddress: string): PromiseResult<void> => {
  const user = await getUserByEmailAddress(connection, emailAddress)
  if (user === null) {
    return new Error("Cannot find user")
  }

  if (isError(user)) {
    return user
  }

  const firstEmailSection = emailAddress.split("@")[0]
  const forenames = user.forenames.split(" ")
  const surnames = user.surname.split(" ")

  const allSensitiveWords = [...forenames, ...surnames, firstEmailSection, user.username]
  if (allSensitiveWords.some((word) => password.includes(word))) {
    return new Error(
      "Password can't include identifiable information for example your name, last name or email address"
    )
  }

  return undefined
}
