import type Database from "types/Database"
import type Task from "types/Task"
import { isError } from "types/Result"
import type PromiseResult from "types/PromiseResult"

export default async (connection: Database | Task, userName: string): PromiseResult<void> => {
  const updateUserQuery = `
    UPDATE br7own.users
    SET last_logged_in = NOW(),
    last_login_attempt = DEFAULT
    WHERE username = \${userName}
      AND deleted_at IS NULL
  `
  const result = await connection.result(updateUserQuery, { userName }).catch((error) => error)

  if (isError(result)) {
    return result
  }

  if (result.rowCount === 0) {
    return Error("User not found.")
  }

  return undefined
}
