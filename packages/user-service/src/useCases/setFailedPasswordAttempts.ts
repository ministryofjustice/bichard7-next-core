import Database from "types/Database"
import PromiseResult from "types/PromiseResult"

export default (connection: Database, emailAddress: string, failedPasswordAttempts: number): PromiseResult<void> => {
  const query = `
        UPDATE br7own.users
        SET failed_password_attempts = $\{failedPasswordAttempts\}
        WHERE LOWER(email) = LOWER($\{emailAddress\}) AND deleted_at IS NULL
    `

  return connection.none(query, { failedPasswordAttempts, emailAddress }).catch((error) => error)
}
