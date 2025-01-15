import type postgres from "postgres"

import { type User } from "@moj-bichard7/common/types/User"

export default async (sql: postgres.Sql, username: string): Promise<User> => {
  const [user]: [User?] = await sql`
      SELECT
        u.id,
        u.username,
        u.jwt_id,
        ARRAY_AGG(g.friendly_name) AS groups,
        u.visible_forces,
        u.email,
        u.forenames,
        u.surname
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
    throw new Error(`User "${username}" does not exist`)
  }

  return user
}
