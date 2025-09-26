import config from "lib/config"
import Database from "types/Database"
import PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"

const validateUserVerificationCode = async (
  connection: Database,
  emailAddress: string,
  verificationCode: string
): PromiseResult<void> => {
  if (!verificationCode || verificationCode.length !== config.verificationCodeLength) {
    return new Error("Invalid Verification Code ")
  }
  const query = `
    SELECT *
    FROM br7own.users
    WHERE LOWER(email) = LOWER($1)
      AND password_reset_code = $2
      AND deleted_at IS NULL
    `

  const result = await connection.result(query, [emailAddress, verificationCode])
  if (isError(result)) {
    return result
  }

  if (result.rowCount === 0) {
    return Error("User not found.")
  }

  return undefined
}

export default validateUserVerificationCode
