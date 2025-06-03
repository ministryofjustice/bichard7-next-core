import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User, UserRow } from "@moj-bichard7/common/types/User"

import { isError } from "@moj-bichard7/common/types/Result"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import mapUserRowToUser from "../mapUserRowToUser"

export default async (database: DatabaseConnection, username: string): PromiseResult<User> => {
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
        username = ${username}
      GROUP BY
        u.id,
        u.username
    `.catch((error: Error) => error)

  if (isError(userResult)) {
    return Error(`Error while fetching user by username for "${username}": ${userResult.message}`)
  }

  if (!userResult || userResult.length === 0) {
    return Error(`User "${username}" does not exist`)
  }

  return mapUserRowToUser(userResult[0])
}
