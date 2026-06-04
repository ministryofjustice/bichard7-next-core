import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User, UserRow } from "@moj-bichard7/common/types/User"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import mapUserRowToUser from "../mapUserRowToUser"

export type FetchUsersResult = {
  users: User[]
}

export default async (
  database: DatabaseConnection,
  user: User,
  usernameOrName?: string
): PromiseResult<FetchUsersResult> => {
  const sql = database.connection

  if (user.visibleForces.length === 0) {
    return { users: [] }
  }

  const forceClauses = user.visibleForces.map((f) => {
    const trimmedForceCode = f.replace(/^0+(\d+)/, "$1")

    const visibleForce = String.raw`\y0+${trimmedForceCode}\y`

    return sql`u.visible_forces ~ ${visibleForce}`
  })

  let forceWhere = forceClauses[0]

  if (forceClauses.length > 1) {
    for (let i = 1; i <= forceClauses.length - 1; i++) {
      forceWhere = sql`${forceWhere} OR ${forceClauses[i]}`
    }
  }

  let finalWhere = sql`(${forceWhere})`

  if (usernameOrName && usernameOrName.trim() !== "") {
    const fuzzyName = `%${usernameOrName.trim()}%`
    const nameWhere = sql`u.username ILIKE ${fuzzyName} OR u.forenames ILIKE ${fuzzyName} OR u.surname ILIKE ${fuzzyName}`
    finalWhere = sql`${finalWhere} AND (${nameWhere})`
  }

  const userResult = await database.connection<UserRow[]>`
      SELECT
        u.id,
        u.forenames,
        u.surname
      FROM
        br7own.users u
        JOIN br7own.users_groups ug ON u.id = ug.user_id
        JOIN br7own.groups g ON g.id = ug.group_id
      WHERE
          ${finalWhere}
      GROUP BY
          u.id`

  const users = userResult.map((u) => mapUserRowToUser(u))

  return { users: users }
}
