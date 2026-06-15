import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User, UserMinimal, UserMinimalRow } from "@moj-bichard7/common/types/User"

import { isError } from "@moj-bichard7/common/types/Result"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import { NotFoundError } from "../../../types/errors/NotFoundError"
import mapUserMinimalRowToMinimalUser from "../mapUserMinimalRowToMinimalUser"
import filterUsersByVisibleForces from "./filterUsersByVisibleForces"

export default async (database: DatabaseConnection, user: User, id: number): PromiseResult<UserMinimal> => {
  const sql = database.connection

  if (user.visibleForces.length === 0) {
    return new Error(`User with ID "${id}" has no visible forces`)
  }

  const visibleForcesFilter = filterUsersByVisibleForces(database, user.visibleForces)

  const visibleForcesWhere = sql`(${visibleForcesFilter})`

  const userResult = await database.connection<UserMinimalRow[]>`
      SELECT
        u.id,
        u.username,
        ARRAY_AGG(g.friendly_name) AS groups,
        u.visible_forces,
        u.visible_courts,
        u.deleted_at
      FROM
        br7own.users u
        LEFT JOIN br7own.users_groups ug ON u.id = ug.user_id
        LEFT JOIN br7own.groups g ON g.id = ug.group_id
      WHERE
        ${visibleForcesWhere} AND u.id = ${id} AND u.deleted_at IS NULL
      GROUP BY
        u.id,
        u.username
    `.catch((error: Error) => error)

  if (isError(userResult)) {
    return new Error(`Error while fetching user by ID for "${id}": ${userResult.message}`)
  }

  if (!userResult || userResult.length === 0) {
    return new NotFoundError()
  }

  return mapUserMinimalRowToMinimalUser(userResult[0])
}
