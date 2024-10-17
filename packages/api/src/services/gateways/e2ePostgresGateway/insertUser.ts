import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"

export default async (sql: postgres.Sql, partialUser: Partial<User>) => {
  if (!(partialUser.email && partialUser.username)) {
    throw new Error("Missing required attributes")
  }

  const user = partialUser as User

  const [result]: [User?] = await sql`
    INSERT INTO br7own.users (username, email, jwt_id)
    VALUES (${user.username}, ${user.email}, ${user.jwt_id});
  `

  if (!result) {
    throw new Error("Could not insert User into the DB")
  }

  return result
}
