import type Database from "types/Database"
import type UserGroup from "types/UserGroup"

export default async (connection: Database, userId: number, groupName: UserGroup): Promise<boolean> => {
  const query = `
    SELECT COUNT(1)
    FROM br7own.users_groups as u
    INNER JOIN br7own.groups as g ON u.group_id = g.id
    WHERE u.user_id = $1
      AND g.name = $2
  `

  const result = await connection.any(query, [userId, `${groupName}_grp`])

  if (result.length !== 1 || result[0].count !== "1") {
    return false
  }

  return true
}
