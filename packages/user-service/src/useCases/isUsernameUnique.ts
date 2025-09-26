import Database from "types/Database"
import PromiseResult from "types/PromiseResult"

export default async (connection: Database, username: string): PromiseResult<void> => {
  const query = `SELECT COUNT(1) FROM br7own.users WHERE LOWER(username) = LOWER($1)`
  const result = await connection.any(query, [username])

  if (result.length === 1 && result[0].count === "1") {
    return new Error(`Username ${username} already exists.`)
  }

  return undefined
}
