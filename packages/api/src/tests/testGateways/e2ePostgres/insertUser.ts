import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"

export default async (sql: postgres.Sql, partialUser: Partial<User>) => {
  if (!(partialUser.email && partialUser.username)) {
    throw new Error("Missing required attributes")
  }

  const user = partialUser as unknown as User

  const [result]: [User?] = await sql`
    INSERT INTO br7own.users (username, email, jwt_id, visible_forces, visible_courts, forenames, surname, excluded_triggers)
    VALUES (${user.username}, ${user.email}, ${user.jwt_id}, ${user.visible_forces}, ${user.visible_courts}, ${user.forenames}, ${user.surname}, ${user.excluded_triggers})
    RETURNING id, username, email, jwt_id, visible_forces, visible_courts, forenames, surname, excluded_triggers;
  `

  if (!result) {
    throw new Error("Could not insert User into the DB")
  }

  return result
}
