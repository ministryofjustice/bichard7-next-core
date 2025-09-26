import type Database from "types/Database"
import type PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"

export default async (
  connection: Database,
  emailAddress: string,
  passwordResetCode: string | null
): PromiseResult<void> => {
  let updateUserQuery = `
    UPDATE br7own.users
    SET password_reset_code = $1
    WHERE LOWER(email) = LOWER($2) AND deleted_at IS NULL
  `
  if (passwordResetCode === null) {
    updateUserQuery = `
      UPDATE br7own.users
      SET password_reset_code = NULL
      WHERE LOEWR(email) = LOWER($2) AND deleted_at IS NULL
    `
  }

  const result = await connection.result(updateUserQuery, [passwordResetCode, emailAddress]).catch((error) => error)
  if (isError(result)) {
    return result
  }

  if (result.rowCount === 0) {
    return Error("User not found")
  }

  return undefined
}
