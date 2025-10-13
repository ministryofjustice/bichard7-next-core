import type Database from "types/Database"
import type PromiseResult from "types/PromiseResult"

const resetUserVerificationCode = async (connection: Database, emailAddress: string): PromiseResult<void> => {
  const updateUserQuery = `
        UPDATE br7own.users
        SET email_verification_code = NULL,
          failed_password_attempts = 0
        WHERE LOWER(email) = LOWER($1)
          AND deleted_at IS NULL
      `

  const result = await connection.result(updateUserQuery, [emailAddress]).catch((error) => error)
  return result
}

export default resetUserVerificationCode
