import type Database from "types/Database"
import type { UserGroupResult } from "types/UserGroup"
import type PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"

const getGroup = async (connection: Database, groupName: string): PromiseResult<UserGroupResult | Error> => {
  const getGroupQuery = `
    SELECT DISTINCT
      g.id,
      g.name,
      g.friendly_name
    FROM br7own.groups AS g
    WHERE g.name = $\{groupName\}
  `

  const result = await connection.any(getGroupQuery, { groupName })

  if (isError(result)) {
    return result
  }

  return result[0]
}

export default getGroup
