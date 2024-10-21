import type { User } from "@moj-bichard7/common/types/User"
import type { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import type postgres from "postgres"

export default async (sql: postgres.Sql, user: User, groups: UserGroup[]) => {
  const result: UserGroup[] = []

  groups.forEach(async (group) => {
    await sql`
      INSERT INTO br7own.users_groups (
        SELECT id as user_id, (
          SELECT id
          FROM br7own.groups
          WHERE friendly_name = ${group}
        ) as group_id
        FROM br7own.users
        WHERE username = ${user.username}
      );
    `

    result.push(group)
  })

  return result
}
