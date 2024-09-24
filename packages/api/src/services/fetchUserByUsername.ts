import { type User } from "@moj-bichard7/common/types/User"
import { type Sql } from "postgres"

export default async function (sql: Sql, username: string) {
  const [user]: [User?] = await sql`
      SELECT
        u.id,
        u.username,
        u.jwt_id,
        ARRAY_AGG(g.friendly_name) AS groups
      FROM
        br7own.users u
        JOIN br7own.users_groups ug ON u.id = ug.user_id
        JOIN br7own.groups g ON g.id = ug.group_id
      WHERE
        username = ${username}
      GROUP BY
        u.id,
        u.username
    `

  if (!user) {
    throw new Error(`User ${username} does not exist`)
  }

  return user
}
