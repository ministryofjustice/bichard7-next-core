import type Database from "types/Database"
import type PromiseResult from "types/PromiseResult"

export default async (connection: Database, email: string): PromiseResult<void> => {
  const query = "SELECT COUNT(1) FROM br7own.users WHERE LOWER(email) = LOWER($1)"
  const result = await connection.any(query, [email])

  if (result.length === 1 && result[0].count === "1") {
    return new Error(`Email address ${email} already exists.`)
  }

  return undefined
}
