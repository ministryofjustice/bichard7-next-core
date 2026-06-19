import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import { type User, UserRowSchema } from "@moj-bichard7/common/types/User"
import z from "zod"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import mapUserRowToUser from "../mapUserRowToUser"
import filterUsersByVisibleForces from "./filterUsersByVisibleForces"

export type FetchUsersResult = {
  users: User[]
}

export default async (database: DatabaseConnection, user: User): PromiseResult<FetchUsersResult> => {
  const sql = database.connection

  if (user.visibleForces.length === 0) {
    return { users: [] }
  }

  const visibleForcesFilter = filterUsersByVisibleForces(database, user.visibleForces)

  const where = sql`(${visibleForcesFilter})`

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
        u.surname,
        u.deleted_at
      FROM
        br7own.users u
        JOIN br7own.users_groups ug ON u.id = ug.user_id
        JOIN br7own.groups g ON g.id = ug.group_id
      WHERE
          ${where}
      GROUP BY
          u.id
          u.deleted_at
      ORDER BY 
          LOWER(u.forenames) ASC,
          LOWER(u.surname) ASC`

  const parsedResults = z.array(UserRowSchema).safeParse(userResult)
  if (!parsedResults.success) {
    return parsedResults.error
  }

  const users = parsedResults.data.map((u) => mapUserRowToUser(u))
  return { users }
}
