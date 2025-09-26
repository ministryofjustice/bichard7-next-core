import Database from "types/Database"
import { UserGroupResult } from "types/UserGroup"
import PromiseResult from "types/PromiseResult"

const getUserSpecificGroups = (connection: Database, username: string): PromiseResult<UserGroupResult[]> => {
  const getUserGroupsQuery = `
    SELECT DISTINCT
      g.id,
      g.name,
      g.friendly_name,
      g.parent_id
    FROM br7own.groups AS g
      INNER JOIN br7own.users_groups AS ug ON ug.group_id = g.id
      INNER JOIN br7own.users AS u ON u.id = ug.user_id
    WHERE u.username = $\{username\}
  `

  return connection.any(getUserGroupsQuery, { username }).catch((error) => error as Error)
}

export default getUserSpecificGroups
