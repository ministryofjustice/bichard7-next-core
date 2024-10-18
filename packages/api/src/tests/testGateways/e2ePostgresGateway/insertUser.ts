import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"

export default async (sql: postgres.Sql, partialUser: Partial<User>) => {
  if (!(partialUser.email && partialUser.username)) {
    throw new Error("Missing required attributes")
  }

  const user = partialUser as unknown as User

  const [result]: [User?] = await sql`
    INSERT INTO br7own.users (username, email, jwt_id, visible_forces)
    VALUES (${user.username}, ${user.email}, ${user.jwt_id}, '001')
    RETURNING id, username, email, jwt_id, visible_forces;
  `

  if (!result) {
    throw new Error("Could not insert User into the DB")
  }

  await sql`
    INSERT INTO br7own.users_groups (
      SELECT id as user_id, (
        SELECT id
        FROM br7own.groups
        WHERE name = 'B7GeneralHandler_grp'
      ) as group_id
      FROM br7own.users
      WHERE username = ${user.username}
    );
  `

  return result
}
