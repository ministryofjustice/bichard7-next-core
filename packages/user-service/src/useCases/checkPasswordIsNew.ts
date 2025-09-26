import { verifyPassword } from "lib/argon2"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import Task from "types/Task"

type passwordHistory = {
  password_hash: string
}

const checkPasswordIsNew = async (
  connection: Database | Task,
  userId: number,
  newPassword: string
): PromiseResult<void> => {
  const getAllMatchingPasswords = `
      SELECT
        password_hash
      FROM br7own.password_history
      WHERE user_id = $1
    `
  try {
    const result = await connection.result<passwordHistory>(getAllMatchingPasswords, [userId])
    const rows = result.rows
    const filteredRows = rows.map((row) => verifyPassword(newPassword, row.password_hash))
    const comparedResults = await Promise.all(filteredRows)

    if (comparedResults.some((item) => item === true)) {
      return Error("Cannot save previously used password.")
    }
  } catch (error) {
    return isError(error) ? error : Error("Error verifying password")
  }

  return undefined
}

export default checkPasswordIsNew
