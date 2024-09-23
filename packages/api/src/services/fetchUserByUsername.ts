import { type User } from "@moj-bichard7/common/types/User"
import { type Sql } from "postgres"

export default async function (db: Sql, username: string) {
  const [user]: [User?] = await db`SELECT * FROM br7own.users WHERE username = ${username}`

  if (!user) {
    throw new Error(`User ${username} does not exist`)
  }

  return user
}
