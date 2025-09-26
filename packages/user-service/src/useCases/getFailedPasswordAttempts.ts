import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"

export default async (connection: Database, emailAddress: string): PromiseResult<number> => {
  const query = `
        SELECT
            failed_password_attempts AS "failedPasswordAttempts"
        FROM br7own.users
        WHERE LOWER(email) = LOWER($1) AND deleted_at IS NULL
    `

  const result = await connection.oneOrNone(query, [emailAddress]).catch((error) => error)
  if (isError(result)) {
    return result
  }

  if (!result) {
    return Error("User not found")
  }

  return result.failedPasswordAttempts
}
