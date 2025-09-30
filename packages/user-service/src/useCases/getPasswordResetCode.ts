import type Database from "types/Database"
import type PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"

export default async (connection: Database, emailAddress: string): PromiseResult<string> => {
  const query = `
    SELECT
      password_reset_code AS "passwordResetCode"
    FROM br7own.users
    WHERE LOWER(email) = LOWER($1) AND deleted_at IS NULL
  `
  const result = await connection
    .oneOrNone<{ passwordResetCode: string }>(query, [emailAddress])
    .catch((error) => error)

  if (isError(result)) {
    return result
  }

  if (!result) {
    return new Error("User not found")
  }

  return result.passwordResetCode
}
