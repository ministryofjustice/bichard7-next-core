import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User, UserRow } from "@moj-bichard7/common/types/User"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import mapUserRowToUser from "../mapUserRowToUser"

export type FetchUsersResult = {
  users: User[]
}

export default async (database: DatabaseConnection, user: User): PromiseResult<FetchUsersResult> => {
  const sql = database.connection

  const forceClauses = user.visibleForces.map((f) => {
    const trimmedForceCode = f.replace(/^0+(\d+)/, "$1")

    const visibleForceRegex = String.raw`\y0+${trimmedForceCode}\y`

    return sql`u.visible_forces ~ ${visibleForceRegex}`
  })

  let where = forceClauses[0]

  if (forceClauses.length > 1) {
    for (let i = 1; i <= forceClauses.length - 1; i++) {
      where = sql`${where} OR ${forceClauses[i]}`
    }
  }

  const userResult = await database.connection<UserRow[]>`
      SELECT
        u.id,
        u.username,
        u.jwt_id,
        ARRAY_AGG(g.friendly_name) AS groups,
        u.visible_forces,
        u.email,
        u.feature_flags,
        u.excluded_triggers,
        u.visible_courts,
        u.forenames,
        u.surname
      FROM
        br7own.users u
        JOIN br7own.users_groups ug ON u.id = ug.user_id
        JOIN br7own.groups g ON g.id = ug.group_id
      WHERE
          ${where}
      GROUP BY
          u.id`

  const users = userResult.map((u) => mapUserRowToUser(u))

  return { users: users }
}
