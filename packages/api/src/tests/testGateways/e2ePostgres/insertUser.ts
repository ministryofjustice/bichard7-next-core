import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"

export default async (sql: postgres.Sql, partialUser: Partial<User>) => {
  if (!(partialUser.email && partialUser.username)) {
    throw new Error("Missing required attributes")
  }

  const user = partialUser as unknown as User

  const [result]: [User?] = await sql`
    INSERT INTO br7own.users (username, email, jwt_id, visible_forces, forenames, surname)
    VALUES (${user.username}, ${user.email}, ${user.jwt_id}, '001', ${user.forenames}, ${user.surname})
    RETURNING id, username, email, jwt_id, visible_forces, forenames, surname;
  `

  if (!result) {
    throw new Error("Could not insert User into the DB")
  }

  return result
}
