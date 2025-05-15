import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import { isError } from "@moj-bichard7/common/types/Result"
import { type User } from "@moj-bichard7/common/types/User"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import formatForceNumbers from "../../formatForceNumbers"

export default async (database: DatabaseConnection, username: string): PromiseResult<User> => {
  const userResult = await database.connection`
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
    throw new Error(`User "${username}" does not exist`)
  }

  const user = userResult[0]

  return {
    email: user.email,
    excludedTriggers: user.excluded_triggers?.split(",").filter(Boolean) ?? [],
    featureFlags: user.feature_flags,
    forenames: user.forenames,
    groups: user.groups,
    id: user.id,
    jwtId: user.jwt_id,
    surname: user.surname,
    username: user.username,
    visibleCourts: user.visible_courts?.split(",").filter(Boolean) ?? [],
    visibleForces: formatForceNumbers(user.visible_forces)
  }
}
